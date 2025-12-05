import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`w-full mx-auto px-4 sm:px-6 xl:px-16 2xl:px-32 ${className}`}>
      {children}
    </div>
  );
}
