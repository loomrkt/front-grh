"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Moon,
  SearchIcon,
  Settings,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRemoteComponent } from "@/hooks/use-remote-component";
import { Edit2, X } from "lucide-react";

export function getRemoteComponent() {
  const ModeToggle = useRemoteComponent("ModeToggle", {
    useTheme,
    Button,
    Moon,
    Sun,
  });

  const DropHelpdesk = useRemoteComponent("DropHelpdesk", {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    HelpCircle,
    Button,
  });

  const DropSettings = useRemoteComponent("DropSettings", {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    Settings,
    Button,
  });

  const DropNotification = useRemoteComponent("DropNotification", {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    Bell,
    Button,
  });

  const DropUser = useRemoteComponent("DropUser", {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    Avatar,
    AvatarImage,
    AvatarFallback,
    Button,
    ChevronDown,
  });

  const Navbar = useRemoteComponent("Navbar", {
    DropUser,
    DropNotification,
    DropHelpdesk,
    DropSettings,
    ModeToggle,
  });

  const Sidebar = useRemoteComponent("Sidebar", {
    useTheme,
    useState,
    useEffect,
    ChevronLeft,
    ChevronRight,
    ModeToggle,
    DropHelpdesk,
    DropSettings,
    Image,
    usePathname,
    Link,
  });

  const LayoutSidebarNavbar = useRemoteComponent(
    "LayoutSidebarNavbar",
    {
      Sidebar,
      Navbar,
    }
  );

  const CustomBreadcrumb = useRemoteComponent("CustomBreadcrumb", {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Link,
  });

  const SearchInput = useRemoteComponent("SearchInput", {
    Input,
    SearchIcon,
  });

  const CustomButton = useRemoteComponent("CustomButton", {
    Button,
  });

  const AppTable = useRemoteComponent("AppTable", {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    useRouter,
    Edit2,
    X,
  });

  const PaginationControls = useRemoteComponent(
    "PaginationControls",
    {
      Pagination,
      PaginationContent,
      PaginationEllipsis,
      PaginationItem,
      PaginationLink,
      PaginationNext,
      PaginationPrevious,
    }
  );

  const CustomSelect = useRemoteComponent("CustomSelect", {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useState,
  });

  const DatePicker = useRemoteComponent("DatePicker", {
    CalendarIcon,
    Input,
    Calendar,
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
  });

  const CustomInput = useRemoteComponent("CustomInput", {
    Input,
    CustomSelect,
    DatePicker,
  });

  const CustomTabs = useRemoteComponent("CustomTabs", {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  });

  return {
    ModeToggle,
    DropHelpdesk,
    DropSettings,
    DropNotification,
    DropUser,
    Navbar,
    Sidebar,
    LayoutSidebarNavbar,
    CustomBreadcrumb,
    SearchInput,
    CustomButton,
    AppTable,
    PaginationControls,
    CustomInput,
    CustomTabs,
  };
}
