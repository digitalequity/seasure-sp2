// firebase/functions/src/index.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendNotificationHandler } from './notifications';
import { generateInvoiceHandler } from './invoices';
import { processAIRequestHandler } from './ai';
import { syncWithSeaSureHandler } from './sync';
import { generateReportHandler } from './reports';

// Initialize Firebase Admin
admin.initializeApp();

// Cloud Functions exports
export const sendNotification = functions.https.onCall(sendNotificationHandler);
export const generateInvoice = functions.https.onCall(generateInvoiceHandler);
export const processAIRequest = functions.https.onCall(processAIRequestHandler);
export const syncWithSeaSure = functions.https.onCall(syncWithSeaSureHandler);
export const generateReport = functions.https.onCall(generateReportHandler);

// Firestore triggers
export const onRequestCreated = functions.firestore
  .document('requests/{requestId}')
  .onCreate(async (snap, context) => {
    const request = snap.data();
    const requestId = context.params.requestId;
    
    // Send notification to service provider
    if (request.serviceProviderId) {
      await admin.firestore()
        .collection('serviceProviders')
        .doc(request.serviceProviderId)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            const provider = doc.data();
            if (provider?.settings?.notifications?.newRequests) {
              // Send push notification
              const payload = {
                notification: {
                  title: 'New Service Request',
                  body: `New ${request.type} request for ${request.boatName}`,
                },
                data: {
                  requestId,
                  type: 'new_request',
                },
              };
              
              // Send to FCM token if available
              if (provider.fcmToken) {
                await admin.messaging().sendToDevice(provider.fcmToken, payload);
              }
            }
          }
        });
    }
  });

export const onRequestStatusChanged = functions.firestore
  .document('requests/{requestId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const requestId = context.params.requestId;
    
    if (before.status !== after.status) {
      // Log status change
      await admin.firestore()
        .collection('requests')
        .doc(requestId)
        .collection('statusHistory')
        .add({
          from: before.status,
          to: after.status,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          changedBy: after.lastModifiedBy || 'system',
        });
      
      // Send notification to boat owner
      if (after.ownerId) {
        const payload = {
          notification: {
            title: 'Request Status Updated',
            body: `Your ${after.type} request is now ${after.status}`,
          },
          data: {
            requestId,
            type: 'status_update',
            status: after.status,
          },
        };
        
        // This would send to the boat owner through SeaSure platform
        // Implementation depends on SeaSure integration
      }
    }
  });

// Scheduled functions
export const dailyMaintenanceReminder = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Query all boats with maintenance due tomorrow
    const boatsSnapshot = await admin.firestore()
      .collection('boats')
      .where('status', '==', 'active')
      .get();
    
    for (const boatDoc of boatsSnapshot.docs) {
      const boat = boatDoc.data();
      if (boat.maintenanceSchedule) {
        for (const item of boat.maintenanceSchedule) {
          const dueDate = item.nextDueDate.toDate();
          if (dueDate >= today && dueDate <= tomorrow) {
            // Send reminder to service provider
            const payload = {
              notification: {
                title: 'Maintenance Due Tomorrow',
                body: `${item.name} is due for ${boat.name}`,
              },
              data: {
                boatId: boatDoc.id,
                maintenanceItemId: item.id,
                type: 'maintenance_reminder',
              },
            };
            
            // Send notification to service provider
            if (boat.serviceProviderId) {
              const providerDoc = await admin.firestore()
                .collection('serviceProviders')
                .doc(boat.serviceProviderId)
                .get();
              
              if (providerDoc.exists) {
                const provider = providerDoc.data();
                if (provider?.fcmToken) {
                  await admin.messaging().sendToDevice(provider.fcmToken, payload);
                }
              }
            }
          }
        }
      }
    }
  });

// Clean up old data
export const cleanupOldData = functions.pubsub
  .schedule('every sunday 02:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Clean up old completed requests
    const oldRequestsSnapshot = await admin.firestore()
      .collection('requests')
      .where('status', '==', 'completed')
      .where('completedDate', '<', sixMonthsAgo)
      .get();
    
    const batch = admin.firestore().batch();
    let deleteCount = 0;
    
    oldRequestsSnapshot.forEach((doc) => {
      if (deleteCount < 500) { // Firestore batch limit
        batch.delete(doc.ref);
        deleteCount++;
      }
    });
    
    if (deleteCount > 0) {
      await batch.commit();
      console.log(`Deleted ${deleteCount} old completed requests`);
    }
  });