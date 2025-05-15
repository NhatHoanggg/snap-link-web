'use client';

import Link from 'next/link';
import { CalendarDays, FileText, History } from 'lucide-react';

export default function MyBookingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Link 
                    href="/my-booking/bookings" 
                    className="group relative bg-card rounded-lg border border-border p-6 hover:border-primary transition-all duration-200"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <CalendarDays className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Lịch Hẹn</h2>
                            <p className="text-muted-foreground">Xem và quản lý các lịch hẹn chụp ảnh của bạn</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-all duration-200"></div>
                </Link>

                <Link 
                    href="/my-booking/requests" 
                    className="group relative bg-card rounded-lg border border-border p-6 hover:border-primary transition-all duration-200"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Yêu Cầu</h2>
                            <p className="text-muted-foreground">Xem và theo dõi trạng thái các yêu cầu chụp ảnh của bạn</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-all duration-200"></div>
                </Link>

                <Link 
                    href="/my-booking/requests" 
                    className="group relative bg-card rounded-lg border border-border p-6 hover:border-primary transition-all duration-200"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <History className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Lịch Sử Đặt</h2>
                            <p className="text-muted-foreground">
                                Xem lịch sử
                            </p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-all duration-200"></div>
                </Link>
            </div>
        </div>
    );
} 