import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full h-fit sticky top-0 bg-white shadow-lg flex p-2 gap-4 items-center">
      <div>
        <Image
          src="/favicon.png"
          alt="logo"
          width={30}
          height={30}
          className="border rounded-full"
        />
      </div>
      <Link href="/">
        <div>INJE CCC</div>
      </Link>
    </div>
  );
}
