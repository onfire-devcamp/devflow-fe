import Hero from '../assets/HeroSection.png';
import {Button} from '../../../components/ui/Button';
import {ArrowRight} from 'lucide-react';
import { PATHS } from '../../../config/paths';
import { useNavigate } from 'react-router-dom';
export default function HeroSection() {
    const navigate = useNavigate();
    return(
        <section className='max-w-7xl mx-auto px-6 py-24'>
            <div className= " flex flex-col lg:flex-row items-center justify-between gap-16">

                <div className = " max-w-2xl">

                    <h1 className = "text-5xl lg:text-7xl font-bold leading-tight text-slate-900">
                        Stop watching tutorials
                        <br />
                        <span className="text-primary">
                            Build real apps
                        </span>
                        <br />
                        with an AI mentor
                    </h1>

                    <Button variant = "primary" onClick={() => navigate(PATHS.DASHBOARD)} className="mt-10 w-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl">
                        Start your first project
                        <ArrowRight size={18} />
                    </Button>
                </div>

                <div className = "w-full max-w-xl">
                    <img src={Hero} />
                </div>
            </div>
        </section>
    );
}