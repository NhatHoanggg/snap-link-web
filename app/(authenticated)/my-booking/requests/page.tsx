'use client';

import { useEffect, useState } from 'react';
import { getMyRequests, RequestResponse } from '@/services/request.service';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function MyRequestsPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<RequestResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyRequests = async () => {
            try {
                const data = await getMyRequests();
                setRequests(data);
            } catch (err) {
                setError('Không thể tải danh sách yêu cầu');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyRequests();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-destructive">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-foreground">Yêu Cầu Của Tôi</h1>
            <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Mã Yêu Cầu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ngày Chụp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Concept</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ngân Sách</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Loại Chụp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Địa Điểm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {requests.map((request) => (
                                <tr 
                                    key={request.request_id} 
                                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/my-booking/requests/${request.request_id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                        <Badge variant="outline" className="ml-2">
                                            #{request.request_code}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {format(new Date(request.request_date), 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {request.concept}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {request.estimated_budget} VND
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {request.shooting_type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {request.location_text}, {request.province}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge 
                                            variant="secondary"
                                            className={`${
                                                request.status === 'open' ? 'bg-accent text-accent-foreground' : 
                                                request.status === 'matched' ? 'bg-secondary text-secondary-foreground' : 
                                                'bg-destructive text-destructive-foreground'
                                            }`}
                                        >
                                            {request.status === 'open' ? 'Mở' :
                                             request.status === 'matched' ? 'Đã Ghép Cặp' :
                                             'Đã Đóng'}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
