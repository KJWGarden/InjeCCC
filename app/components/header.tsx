import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full sticky top-0 shadow-lg flex p-2 gap-4 items-center">
      <div>
        <Image
          src="/favicon.png"
          alt="logo"
          width={30}
          height={30}
          className="border rounded-full"
        />
      </div>
      <div>INJE CCC</div>
    </div>
  );
}
