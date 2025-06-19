"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOfferDetail, OfferDetailResponse } from "@/services/offer.service";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function OfferDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [offer, setOffer] = useState<OfferDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const data = await getOfferDetail(Number(params.request_offer_id));
                setOffer(data);
            } catch {
                setError("Không thể tải thông tin đề xuất");
                toast.error("Không thể tải thông tin đề xuất");
            } finally {
                setLoading(false);
            }
        };
        fetchOffer();
    }, [params.request_offer_id]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error || !offer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-destructive text-lg font-medium">{error || "Không tìm thấy thông tin đề xuất"}</div>
                <Button variant="outline" onClick={() => router.back()}>
                    Quay lại
                </Button>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto px-4 py-8">
            <Button variant="outline" className="mb-4" onClick={() => router.back()}>
                Quay lại danh sách đề xuất
            </Button>
            <div className="bg-card rounded-lg border border-border p-6">
                <h1 className="text-2xl font-bold mb-4">Chi tiết đề xuất</h1>
                <div className="mb-2">
                    <span className="font-semibold">Dịch vụ: </span> {offer.service_title}
                </div>
                <div className="mb-2">
                    <span className="font-semibold">Giá gốc: </span> {offer.service_price} VND
                </div>
                <div className="mb-2">
                    <span className="font-semibold">Giá đề xuất: </span> {offer.custom_price} VND
                </div>
                <div className="mb-2">
                    <span className="font-semibold">Trạng thái: </span> {offer.status}
                </div>
                <div className="mb-2">
                    <span className="font-semibold">Ngày tạo: </span> {format(new Date(offer.created_at), 'dd/MM/yyyy')}
                </div>
                <div className="mb-2">
                    <span className="font-semibold">Nhiếp ảnh gia: </span> {offer.photographer_name}
                </div>
                <div className="mb-2">
                    <span className="font-semibold">Lời nhắn: </span>
                    <div className="whitespace-pre-line">
                        {offer.message}
                    </div>
                </div>
                <div className="mb-2">
                    <span className="font-semibold ">Mô tả dịch vụ: </span> 
                    
                    <div className="white-space-pre-line">
                        {offer.service_description}
                    </div>
                </div>
                {offer.service_thumbnail_url && (
                    <div className="mb-2">
                        <span className="font-semibold">Hình ảnh dịch vụ:</span>
                        <img
                            src={offer.service_thumbnail_url}
                            alt={offer.service_title}
                            className="w-full h-48 object-cover rounded-lg mt-2"
                        />
                    </div>
                )}
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
} 