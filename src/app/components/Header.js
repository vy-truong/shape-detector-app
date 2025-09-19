"use client"; 
import { playfair, intern } from "../fonts";
import Link from "next/link"; 
import { useState } from "react";

// MUI imports
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header() {
    const  [open, setOpen ] = useState(false);

    const toggleDrawer = (open) => (e) => {
        if (
            e.type === "keydown" &&
            (e.key === "Tab" || e.key === "Shift")
          ) {
            return;
          }
          setOpen(open);

    };

    const menuItems = [
        { text: "Home", href: "/" },
        { text: "About Us", href: "/about" },
        { text: "Shape Finder", href: "/shapefinder" },
        { text: "Contact Us", href: "/contact" },
        { text: "My Profile", href: "/profile" },
      ];

    return (
        <header className=" relative w-full flex items-center justify-between px-8 py-4 shadow">
            {/* Left: Logo */}
            <div className={` ${playfair.className} text-2xl font-bold`}>SHAPE FINDER</div>

            {/* Center: Main Nav */}
            <nav className="hidden text-md lg:gap-20 md:flex gap-6 ">
                
                <Link href="/">Home</Link>
                <Link href="/about">About Us</Link>
                <Link href="/shapefinder">Shape Finder</Link>
                <Link href="/contact">Contact Us</Link>
            </nav>

            {/* Right: Profile */}
            <div className="hidden md:block">
                <Link href="/profile" className="flex items-center gap-2">
                {/* <User size={20} /> */}
                <span>My Profile</span>
                </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
                
                <IconButton onClick={toggleDrawer(true)}>
                    <MenuIcon fontSize="large"/>
                </IconButton>
            </div>

            {/* Mobile menu */}
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <List sx={{ width: 250 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                    <ListItemButton
                        component="a"
                        href={item.href}
                        onClick={toggleDrawer(false)}
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