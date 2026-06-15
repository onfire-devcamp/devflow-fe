import Logo from '../assets/logo.png';
import {Button} from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../config/paths';
export default function Navbar() {
    return (
        <nav className = "border-b">
            <div className = "max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className = "logo_wrapper">
                    <img src={Logo} />
                </div>

                <div className = "flex gap-4">

                    <Link to={PATHS.LOGIN}>
                        <Button variant = "ghost" className = "px-4 py-2">
                            Sign in
                        </Button>
                    </Link>

                    <Link to={PATHS.REGISTER}> 
                        <Button variant = "primary" className = "w-auto px-4 py-2 rounded-xl">
                            Register
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}