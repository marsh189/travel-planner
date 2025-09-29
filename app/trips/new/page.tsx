'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { createTrip } from '@/lib/actions/create-trip';
import { UploadButton } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import { error } from 'console';
import Image from 'next/image';
import { useState, useTransition } from 'react';

export default function NewTrip() {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>New Trip</CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            action={(formData: FormData) => {
              if (imageUrl) {
                formData.append('imageUrl', imageUrl);
              }
              startTransition(() => {
                createTrip(formData);
              });
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter Trip Name..."
                required
                className={cn(
                  'w-full border border-gray-300 px-3 py-2',
                  'rounded-md focus:outline-none focus:ring-2 fopcus:ring-blue-500'
                )}
              ></input>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter Trip Description..."
                required
                className={cn(
                  'w-full border border-gray-300 px-3 py-2',
                  'rounded-md focus:outline-none focus:ring-2 fopcus:ring-blue-500'
                )}
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className={cn(
                    'w-full border border-gray-300 px-3 py-2',
                    'rounded-md focus:outline-none focus:ring-2 fopcus:ring-blue-500'
                  )}
                ></input>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  className={cn(
                    'w-full border border-gray-300 px-3 py-2',
                    'rounded-md focus:outline-none focus:ring-2 fopcus:ring-blue-500'
                  )}
                ></input>
              </div>
            </div>
            <div>
              <label>Trip Image</label>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Trip Preview"
                  className="w-full mb-4 rounded-md max-h-48 object-cover"
                  width={300}
                  height={100}
                />
              )}
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0].ufsUrl) {
                    setImageUrl(res[0].ufsUrl);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error('Upload Error: ', error);
                }}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Trip'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
