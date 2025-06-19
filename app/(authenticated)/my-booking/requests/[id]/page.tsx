'use client';

import { useEffect, useState } from 'react';
import { getRequestById, RequestResponse, deleteRequest } from '@/services/request.service';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Check, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { photographerService } from '@/services/photographer.service';
import { Button } from '@/components/ui/button';
import { getOfferDetail, OfferDetailResponse, changeOfferStatus } from '@/services/offer.service';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { toast } from 'sonner';
import toast, { Toaster, ToastBar } from "react-hot-toast";


export default function RequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [request, setRequest] = useState<RequestResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [photographerNames, setPhotographerNames] = useState<{[key: number]: string}>({});
    const [selectedOffer, setSelectedOffer] = useState<OfferDetailResponse | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const data = await getRequestById(Number(params.id));
                console.log(data)
                setRequest(data);
                
                // Fetch photographer names for all offers
                if (data.offers && data.offers.length > 0) {
                    const names: {[key: number]: string} = {};
                    for (const offer of data.offers) {
                        try {
                            const name = await photographerService.getPhotographerName(offer.photographer_id);
                            names[offer.photographer_id] = name;
                        } catch (err) {
                            console.error(`Failed to fetch photographer name for ID ${offer.photographer_id}:`, err);
                            names[offer.photographer_id] = 'Unknown Photographer';
                        }
                    }
                    setPhotographerNames(names);
                }
            } catch (err) {
                setError('Không thể tải thông tin yêu cầu');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [params.id]);

    const handleViewDetails = async (offerId: number) => {
        try {
            const offerDetail = await getOfferDetail(offerId);
            setSelectedOffer(offerDetail);
            setIsDetailModalOpen(true);
        } catch (err) {
            console.error('Failed to fetch offer details:', err);
            // You might want to show an error toast here
        }
    };

    const handleStatusChange = async (request_offer_id: number, status: "accepted" | "rejected") => {
        setIsUpdating(true);
        try {
            await changeOfferStatus(request_offer_id, { status });
            toast.success(status === "accepted" ? "Đã chấp nhận đề xuất" : "Đã từ chối đề xuất");
            // Refresh request data
            const data = await getRequestById(Number(params.id));
            setRequest(data);
        } catch (err) {
            console.error(err);
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteRequest = async () => {
        setIsUpdating(true);
        try {
            await deleteRequest(Number(params.id));
            toast.success('Đã xóa yêu cầu thành công');
            router.push('/my-booking/requests');
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi xóa yêu cầu');
        } finally {
            setIsUpdating(false);
        }
    };

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
                                request.status === 'open' ? 'bg-accent text-accent-foreground' : 
                                request.status === 'matched' ? 'bg-secondary text-secondary-foreground' : 
                                'bg-destructive text-destructive-foreground'
                            }`}
                        >
                            {request.status === 'open' ? 'Mở' :
                             request.status === 'matched' ? 'Đã Ghép Cặp' :
                             'Đã Đóng'}
                        </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-sm text-muted-foreground">
                            Ngày tạo: {format(new Date(request.created_at), 'dd/MM/yyyy')}
                        </div>
                        {request.status === 'open' && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        className="gap-1 mt-2"
                                        disabled={isUpdating}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Xóa yêu cầu
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Xác nhận xóa yêu cầu</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Bạn có chắc chắn muốn xóa yêu cầu này? Hành động này không thể hoàn tác.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteRequest}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            disabled={isUpdating}
                                        >
                                            Xác nhận xóa
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
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
                            <p className="text-foreground">{request.location_text}, {request.province}</p>
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
                                className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                                onClick={() => router.push(`/my-booking/requests/${params.id}/${offer.request_offer_id}`)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium text-foreground">
                                            Đề xuất từ nhiếp ảnh gia: {photographerNames[offer.photographer_id] || 'Loading...'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Ngày đề xuất: {format(new Date(offer.created_at), 'dd/MM/yyyy')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {offer.custom_price} VND
                                        </Badge>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="gap-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewDetails(offer.request_offer_id);
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                            Chi tiết
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    className="gap-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                    disabled={isUpdating || request.status === 'matched' || offer.status == "rejected"}
                                                >
                                                    <X className="w-4 h-4" />
                                                    Từ chối
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Xác nhận từ chối đề xuất</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Bạn có chắc chắn muốn từ chối đề xuất này? Hành động này không thể hoàn tác.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusChange(offer.request_offer_id, "rejected");
                                                        }}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        disabled={isUpdating || request.status === 'matched' || offer.status == "rejected"}
                                                    >
                                                        Xác nhận từ chối
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                    variant="default" 
                                                    size="sm" 
                                                    className="gap-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                    disabled={isUpdating || request.status === 'matched'}
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Chấp nhận
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Xác nhận chấp nhận đề xuất</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Bạn có chắc chắn muốn chấp nhận đề xuất này?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusChange(offer.request_offer_id, "accepted");
                                                        }}
                                                        disabled={isUpdating}
                                                    >
                                                        Xác nhận chấp nhận
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Chưa có đề xuất nào</p>
                )}
            </div>

            {/* Offer Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Chi tiết đề xuất</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDetailModalOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogTitle>
                    </DialogHeader>
                    {selectedOffer && (
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <img
                                    src={selectedOffer.photographer_avatar}
                                    alt={selectedOffer.photographer_name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {selectedOffer.photographer_name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Ngày đề xuất: {format(new Date(selectedOffer.created_at), 'dd/MM/yyyy')}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Thông tin dịch vụ</h4>
                                    <div className="space-y-1">
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Tên dịch vụ:</span> {selectedOffer.service_title}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Giá gốc:</span> {selectedOffer.service_price} VND
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Giá đề xuất:</span> {selectedOffer.custom_price} VND
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium">Mô tả dịch vụ</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedOffer.service_description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">Lời nhắn từ nhiếp ảnh gia</h4>
                                <p className="text-sm text-muted-foreground">
                                    {selectedOffer.message}
                                </p>
                            </div>

                            {selectedOffer.service_thumbnail_url && (
                                <div className="space-y-2">
                                    <h4 className="font-medium">Hình ảnh dịch vụ</h4>
                                    <img
                                        src={selectedOffer.service_thumbnail_url}
                                        alt={selectedOffer.service_title}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            <Toaster position="bottom-right">
                {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                    <>
                        {icon}
                        {message}
                        {t.type !== "loading" && (
                        <button onClick={() => toast.dismiss(t.id)}>X</button>
                        )}
                    </>
                    )}
                </ToastBar>
                )}
            </Toaster>
        </div>
    );
} 