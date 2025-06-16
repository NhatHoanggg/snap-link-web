'use client';

import { useEffect, useState } from 'react';
import { getMyOffers, deleteOffer, OfferResponse } from '@/services/offer.service';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

export default function RequestOffersPage() {
    const [offers, setOffers] = useState<OfferResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOffers = async () => {
        try {
            const data = await getMyOffers();
            setOffers(data);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || 'Failed to fetch offers');
            } else {
                toast.error('Failed to fetch offers');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (requestOfferId: number) => {
        try {
            await deleteOffer(requestOfferId);
            toast.success('Offer deleted successfully');
            fetchOffers(); // Refresh the list
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || 'Failed to delete offer');
            } else {
                toast.error('Failed to delete offer');
            }
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">My Offers</h1>
            {offers.length === 0 ? (
                <div className="text-center text-gray-500">No offers found</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service ID</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {offers.map((offer) => (
                            <TableRow key={offer.request_offer_id}>
                                <TableCell>{offer.service_id}</TableCell>
                                <TableCell>${offer.custom_price}</TableCell>
                                <TableCell className="max-w-xs truncate">{offer.message}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {offer.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(offer.created_at), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(offer.request_offer_id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
