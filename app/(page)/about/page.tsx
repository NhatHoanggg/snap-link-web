"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Calendar,
  Users,
  Image as ImageIcon,
  Award,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  const features = [
    {
      title: "Easy Booking",
      description:
        "Schedule photography sessions with your preferred photographers in just a few clicks.",
      icon: <Calendar className="h-12 w-12 text-primary" />,
    },
    {
      title: "Photographer Profiles",
      description:
        "Browse through detailed portfolios and reviews to find the perfect match for your needs.",
      icon: <Users className="h-12 w-12 text-primary" />,
    },
    {
      title: "Photo Storage",
      description:
        "Access and download your photos directly from the platform after your session.",
      icon: <ImageIcon className="h-12 w-12 text-primary" />,
    },
    {
      title: "Quality Assurance",
      description:
        "Verified photographers with ratings and reviews from previous customers.",
      icon: <Award className="h-12 w-12 text-primary" />,
    },
    {
      title: "Real-time Scheduling",
      description:
        "View photographer availability in real-time and pick the perfect time slot.",
      icon: <Clock className="h-12 w-12 text-primary" />,
    },
    {
      title: "AI Recommendations",
      description:
        "Get intelligent photographer suggestions based on your preferences and needs.",
      icon: <Camera className="h-12 w-12 text-primary" />,
    },
  ];

  const teamMembers = [
    {
      name: "Nguyễn Đắc Nhật Hoàng",
      role: "Project Developer",
      bio: "Student at Bach Khoa University, specializing in Information Technology.",
      image: "/images/my-avt.jpg",
    },
    {
      name: "Nguyễn Văn Nguyên",
      role: "Project Supervisor",
      bio: "Master's degree holder and lecturer at Bach Khoa University, guiding the development process.",
      image: "/images/ths-nguyen-van-nguyen.jpg",
    },
  ];

  return (
    <div>
      <div className="container mx-auto py-12 px-4 md:px-6 mt-16">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Connecting Photographers & Clients
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Our platform revolutionizes how photography services are booked,
              making it easier than ever to find the perfect photographer for
              your needs and manage the entire process online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/photographers">Browse Photographers</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative h-64 md:h-96 rounded-lg overflow-hidden border">
            <Image
              src="/images/pg1.jpg"
              alt="Photographer in action"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Our Mission & Vision
          </h2>
          <Tabs defaultValue="mission" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mission">Mission</TabsTrigger>
              <TabsTrigger value="vision">Vision</TabsTrigger>
            </TabsList>
            <TabsContent
              value="mission"
              className="p-6 bg-muted/50 rounded-b-lg"
            >
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To create a seamless connection between photographers and
                clients, streamlining the booking process and enhancing the
                photography service experience for both parties. We aim to
                provide a platform that helps photographers showcase their work
                and manage their business while giving clients an easy way to
                find the perfect photographer for their specific needs.
              </p>
            </TabsContent>
            <TabsContent
              value="vision"
              className="p-6 bg-muted/50 rounded-b-lg"
            >
              <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
              <p className="text-muted-foreground">
                We envision a future where booking photography services is as
                simple as ordering food online. Our platform will become the
                go-to marketplace for photography services in Vietnam and
                beyond, supporting the growth of the creative industry and
                enabling photographers to focus on their craft while we handle
                the business aspects. Through technology integration and
                intelligent matching, we aim to elevate the standard of
                photography services nationwide.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-t-4 border-primary">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Find a Photographer
              </h3>
              <p className="text-muted-foreground">
                Browse through our extensive list of professional photographers.
                Filter by location, style, specialty, and availability to find
                your perfect match.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Your Session</h3>
              <p className="text-muted-foreground">
                Choose from available time slots, select your package, and
                complete your booking with a few simple steps. Receive instant
                confirmation.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Photos</h3>
              <p className="text-muted-foreground">
                After your session, access and download your photos directly
                from our platform. Share, download, or order prints with ease.
              </p>
            </div>
          </div>
        </div>

        {/* For Photographers Section */}
        <div className="mb-16 bg-muted/30 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">For Photographers</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Are you a professional photographer looking to expand your
                client base? Join our platform to:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Showcase your portfolio to potential clients
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Manage your bookings and schedule efficiently
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Deliver photos to clients through our secure platform
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Receive reviews and build your reputation
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Focus on your craft while we handle the business aspects
                </li>
              </ul>
              <Button asChild>
                <Link href="/photographer-signup">Join as a Photographer</Link>
              </Button>
            </div>
            <div className="w-full md:w-1/2 relative h-64 md:h-80 rounded-lg overflow-hidden border">
              <Image
                src="/images/pg2.jpg"
                alt="Photographer with camera"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Project Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden relative mb-4 border">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Info */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            About This Project
          </h2>
          <div className="bg-muted/30 p-8 rounded-lg">
            <p className="text-lg mb-6">
              This online photography booking website is a graduation project
              for Bach Khoa University, Faculty of Information Technology. The
              project aims to create a platform that connects photographers with
              clients, streamlining the booking process and enhancing the
              photography service experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Project Objectives
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Build an effective online platform connecting photographers
                    and clients
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Create user-friendly interfaces for booking photography
                    services
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Implement portfolio management for photographers
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Integrate AI recommendations for improved user experience
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Provide secure photo storage and sharing capabilities
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Technologies Used
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <strong>Frontend:</strong> Next.js, React, shadcn/ui
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <strong>Backend:</strong> FastAPI
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <strong>Design:</strong> Figma
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <strong>Version Control:</strong> GitHub
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <strong>AI Integration:</strong> For smart recommendations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you&apos;re looking for a photographer or offering
            photography services, our platform makes the process simple and
            efficient.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/booking">Book a Photographer</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/photographer-signup">Join as a Photographer</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
