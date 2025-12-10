import Image from "next/image";

export function TopBar() {
  return (
    <div className="flex items-center justify-center py-4">
      <Image
        src="/cotit-logo.png"
        alt="COTIT logo"
        width={320}
        height={80}
        priority
        className="h-10 w-auto sm:h-12"
      />
    </div>
  );
}

