import Logo from '../assets/logo.png';
import {Button} from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../config/paths';
export default function Navbar() {
    return (
        <nav className = "border-primary">
            <div className = "w-full h-16 border-b border-primary-mid/40 flex justify-between items-center bg-card px-4 md:px-6">
                <Link
                    to="/"
                    className="flex items-center space-x-2 select-none cursor-pointer"
                >
                    <img
                    src={Logo} alt="DevFlow Logo" className="h-6 w-auto object-contain" />
                    <span className="font-bold text-lg text-slate-800 tracking-tight">
                    DevFlow
                    </span>
                </Link>

                <div className = "flex gap-4">

                    <Link to={PATHS.LOGIN}>
                        <Button variant = "ghost" className = "px-6 py-2 text-primary hover:scale-105">
                            Sign in
                        </Button>
                    </Link>

                    <Link to={PATHS.REGISTER}> 
                        <Button variant = "primary" className = "w-auto px-6 py-2 rounded-xl hover:scale-105">
                            Register
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}