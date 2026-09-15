import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Logo from './logo';
import NavBarRoutes from './nav-bar-routes';
import { Button } from './ui/button';

const Navbar = async () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-14 flex items-center px-4 ">
      <div className="flex justify-between items-center w-full h-full">
        <Logo />
        <NavBarRoutes />
        <div className="w-36">
          <Show when="signed-out">
            <div className="flex gap-2 items-center">
              <SignInButton>
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center gap-2">
              <UserButton />
            </div>
          </Show>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
