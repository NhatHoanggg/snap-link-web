'use client';

import Link from 'next/link';
import { CalendarDays, FileText, History, Search, Shell, TicketPercent } from 'lucide-react';

export default function MyBookingPage() {
    return (
        
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Link 
                    href="/search" 
                    className="group relative bg-card rounded-lg border border-border p-6 hover:border-primary transition-all duration-200"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Search className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Tìm kiếm và tạo lịch hẹn</h2>
                            <p className="text-muted-foreground text-sm min-h-8">Xem và quản lý các lịch hẹn chụp ảnh của bạn</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-all duration-200"></div>
                </Link>

                <Link 
                    href="/my-booking/bookings" 
                    className="group relative bg-card rounded-lg border border-border p-6 hover:border-primary transition-all duration-200"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <CalendarDays className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Lịch hẹn của bạn</h2>
                            <p className="text-muted-foreground text-sm min-h-8">Xem và quản lý các lịch hẹn chụp ảnh của bạn</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-all duration-200"></div>
                </Link>

                <Link 
                    href="/request" 
                    className="group relative bg-card rounded-lg border border-border p-6 hover:border-primary transition-all duration-200"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Shell className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Tạo yêu cầu</h2>
                            <p className="text-muted-foreground text-sm min-h-8">Tạo yêu cầu chụp ảnh mới</p>
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
                            <h2 className="text-xl font-semibold text-foreground mb-2">Yêu cầu của bạn</h2>
                            <p className="text-muted-foreground text-sm min-h-8">Xem và theo dõi trạng thái các yêu cầu chụp ảnh của bạn</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-all duration-200"></div>
                </Link>

                <Link 
                    href="/my-booking/payments" 
                    className="group relative bg-card rounded-lg border border-border p-6 hover:border-primary transition-all duration-200"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <History className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Lịch sử thanh toán</h2>
                            <p className="text-muted-foreground text-sm min-h-8">
                                Xem lịch sử thanh toán của bạn
                            </p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-all duration-200"></div>
                </Link>

                <Link 
                    href="/my-booking/discounts" 
                    className="group relative bg-card rounded-lg border border-border p-6 hover:border-primary transition-all duration-200"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <TicketPercent className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Mã giảm giá</h2>
                            <p className="text-muted-foreground text-sm min-h-8">
                                Xem và quản lý các mã giảm giá của bạn
                            </p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-all duration-200"></div>
                </Link>
            </div>
        </div>
    );
} 