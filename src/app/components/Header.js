"use client"; 
import Link from "next/link"; 
import { useState } from "react";

// MUI imports
import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";



export default function Header() {
    
    const menuItems = [
        { text: "Home", href: "/" },
        { text: "About Us", href: "/about" },
        { text: "Shape Finder", href: "/shapefinder" },
        { text: "Contact Us", href: "/contact" },
        { text: "My Profile", href: "/profile" },
      ];

    return (
        <header className=" relative w-full flex items-center justify-between px-[4rem] py-4">
            {/* Left: Logo */}
            <div className= "text-xl font-cormo text-heading font-bold">
                {/* <h2>SHAPE FINDER</h2> */}
                <Link href="/">
                    SHAPE FINDER
                </Link>
            </div>

            {/* Center: Main Nav */}
            <nav className="hidden text-md lg:gap-20 md:flex gap-6">
                <Link 
                    href="/" 
                    className="relative font-medium text-heading hover:text-heading-hl transition-colors duration-200"
                >
                    Home
                </Link>
                <Link 
                    href="/about" 
                    className="relative font-medium text-heading hover:text-heading-hl  transition-colors duration-200"
                >
                    About Us
                </Link>
                <Link 
                    href="/shapefinder" 
                    className="relative font-medium text-heading hover:text-heading-hl transition-colors duration-200"
                >
                    Shape Finder
                </Link>
                <Link 
                    href="/contact" 
                    className="relative font-medium text-heading hover:text-heading-hl transition-colors duration-200"
                >
                    Contact Us
                </Link>
                </nav>


            {/* Right: Profile */}
            <div className="hidden md:block">
               
                <Link href="/profile" className="flex items-center gap-2">
                {/* <User size={20} /> */}
                <span className="text-heading hover:text-heading-hl">My Profile</span>
                </Link>
            </div>

            {/* Mobile menu */}
            <Drawer>
                <List sx={{ width: 250 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                    <ListItemButton
                        component="a"
                        href={item.href}
                      
                    >
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                    </ListItem>
                ))}
                </List>
            </Drawer>


        </header>


    );
}