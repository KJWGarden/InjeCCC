"use client";
import { Button } from "./ui/button";

type NavbarProps = {
  setActiveTab: (tab: string) => void;
};

export default function Navbar({ setActiveTab }: NavbarProps) {
  return (
    <div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setActiveTab("home")}>
          홈
        </Button>
        <Button variant="ghost" onClick={() => setActiveTab("disciples")}>
          제자순
        </Button>
        <Button variant="ghost" onClick={() => setActiveTab("hessed")}>
          헤세드순
        </Button>
        <Button variant="ghost" onClick={() => setActiveTab("yedalm")}>
          예닮순
        </Button>
      </div>
    </div>
  );
}
