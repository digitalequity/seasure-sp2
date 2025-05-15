// src/components/requests/RequestTimeline.tsx

import React from 'react';
import { ServiceRequest } from '../../types';
import { formatDate } from '../../utils/helpers';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/solid';

interface RequestTimelineProps {
  request: ServiceRequest;
}

export const RequestTimeline: React.FC<RequestTimelineProps> = ({ request }) => {
  const steps = [
    {
      name: 'Request Created',
      status: 'complete',
      date: request.createdAt
    },
    {
      name: 'Accepted',
      status: request.status !== 'new' ? 'complete' : 'pending',
      date: request.status !== 'new' ? request.updatedAt : null
    },
    {
      name: 'Scheduled',
      status: request.scheduledDate ? 'complete' : 'pending',
      date: request.scheduledDate
    },
    {
      name: 'In Progress',
      status: request.status === 'in_progress' || request.status === 'completed' ? 'complete' : 'pending',
      date: null
    },
    {
      name: 'Completed',
      status: request.status === 'completed' ? 'complete' : 'pending',
      date: request.completedDate
    }
  ];

  return (
    <div className="flow-root">
      <ul className="-my-6">
        {steps.map((step, stepIdx) => (
          <li key={step.name}>
            <div className="relative pb-6">
              {stepIdx !== steps.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                {step.status === 'complete' ? (
                  <div>
                    <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                      <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </div>
                ) : step.status === 'current' ? (
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center ring-8 ring-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-600" />
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{step.name}</span>
                    </div>
                    {step.date && (
                      <p className="mt-0.5 text-sm text-gray-500">
                        {formatDate(step.date)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};