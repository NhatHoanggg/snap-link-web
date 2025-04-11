'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { photographerService, Photographer } from '@/lib/services/photographer.service';

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const data = await photographerService.getPhotographers({
          skip: 0,
          limit: 100,
        });
        setPhotographers(data.photographers);
      } catch (error) {
        console.error('Error fetching photographers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Photographers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photographers.map((photographer) => (
          <Link href={`/photographers/${photographer.slug}`} key={photographer.photographer_id}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative h-64 w-full">
                  <Image
                    src={photographer.avatar || "/images/default.jpg"}
                    alt={photographer.full_name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{photographer.full_name}</h2>
                <p className="text-gray-600 mb-2">{photographer.location}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{photographer.bio}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">
                    {photographer.average_rating.toFixed(1)} ({photographer.total_reviews} reviews)
                  </span>
                </div>
                <div className="text-lg font-semibold">
                  {photographer.price_per_hour.toLocaleString('vi-VN')}đ/h
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
