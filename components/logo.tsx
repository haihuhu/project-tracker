import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <div className="hidden sm:block text-2xl font-bold mr-2">
      <Link href="/" className="flex items-center gap-2" title="Project tracker">
        <Image src="/logoipsum-408.svg" alt="logo" width={100} height={100} className="w-50 h-auto" />
      </Link>
    </div>
  );
};

export default Logo;
