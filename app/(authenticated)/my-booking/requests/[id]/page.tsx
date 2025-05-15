'use client';

import { useEffect, useState } from 'react';
import { getRequestById, RequestResponse } from '@/services/request.service';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RequestDetailPage() {
    const params = useParams();
    const [request, setRequest] = useState<RequestResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const data = await getRequestById(Number(params.id));
                setRequest(data);
            } catch (err) {
                setError('Không thể tải thông tin yêu cầu');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="flex items-center justify-center min-h-screen text-destructive">
                {error || 'Không tìm thấy yêu cầu'}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link 
                href="/my-booking/requests"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
            </Link>

            <div className="bg-card rounded-lg border border-border p-6 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Yêu Cầu #{request.request_code}
                        </h1>
                        <Badge 
                            variant="secondary"
                            className={`${
                                request.status === 'pending' ? 'bg-accent text-accent-foreground' : 
                                request.status === 'approved' ? 'bg-secondary text-secondary-foreground' : 
                                'bg-destructive text-destructive-foreground'
                            }`}
                        >
                            {request.status === 'pending' ? 'Đang Chờ' :
                             request.status === 'approved' ? 'Đã Duyệt' :
                             'Từ Chối'}
                        </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Ngày tạo: {format(new Date(request.created_at), 'dd/MM/yyyy')}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Ngày Chụp</h3>
                            <p className="text-foreground">{format(new Date(request.request_date), 'dd/MM/yyyy')}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Concept</h3>
                            <p className="text-foreground">{request.concept}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Ngân Sách</h3>
                            <p className="text-foreground">{request.estimated_budget} VND</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Loại Chụp</h3>
                            <p className="text-foreground">{request.shooting_type}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Địa Điểm</h3>
                            <p className="text-foreground">{request.location_text}, {request.city}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Hình Minh Họa</h3>
                            {request.illustration_url && (
                                <img 
                                    src={request.illustration_url} 
                                    alt="Illustration" 
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Danh Sách Đề Xuất</h2>
                {request.offers && request.offers.length > 0 ? (
                    <div className="space-y-4">
                        {request.offers.map((offer) => (
                            <div 
                                key={offer.request_offer_id} 
                                className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium text-foreground">
                                            Đề xuất từ {offer.photographer_id}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Ngày đề xuất: {format(new Date(offer.created_at), 'dd/MM/yyyy')}
                                        </p>
                                    </div>
                                    <Badge variant="outline">
                                        {offer.custom_price} VND
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground">{offer.message}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Chưa có đề xuất nào</p>
                )}
            </div>
        </div>
    );
} 