"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SizeGuideData {
  size: string;
  chest: number;
  length: number;
  shoulder: number;
}

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizes: SizeGuideData[];
}

export function SizeGuideModal({ isOpen, onClose, sizes }: SizeGuideModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <DialogTitle className="font-bold tracking-tight uppercase text-2xl">SIZE GUIDE</DialogTitle>
            <DialogDescription className="text-black/50">Measurements in centimeters. Choose the size that fits you best.</DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer le guide des tailles">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left" role="table">
            <thead>
              <tr className="border-b border-black/10">
                <th className="pb-3 font-medium tracking-wider uppercase text-xs text-black/60">SIZE</th>
                <th className="pb-3 font-medium tracking-wider uppercase text-xs text-black/60 text-center">CHEST (cm)</th>
                <th className="pb-3 font-medium tracking-wider uppercase text-xs text-black/60 text-center">LENGTH (cm)</th>
                <th className="pb-3 font-medium tracking-wider uppercase text-xs text-black/60 text-center">SHOULDER (cm)</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr key={size.size} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                  <td className="py-4 font-medium text-black">{size.size}</td>
                  <td className="py-4 text-center text-black/70">{size.chest}</td>
                  <td className="py-4 text-center text-black/70">{size.length}</td>
                  <td className="py-4 text-center text-black/70">{size.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-6 border-t border-black/10 text-center text-sm text-black/50">
          <p>Measure your best-fitting t-shirt and compare with our chart.</p>
          <p className="mt-1">Chest: Measure under arms around fullest part.</p>
          <p>Length: Measure from top of shoulder to bottom hem.</p>
          <p>Shoulder: Measure from shoulder seam to shoulder seam.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}