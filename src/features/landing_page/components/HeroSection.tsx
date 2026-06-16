import Hero from '../assets/HeroSection.png';
import {Button} from '../../../components/ui/Button';
import {ArrowRight} from 'lucide-react';
import { PATHS } from '../../../config/paths';
import { useNavigate } from 'react-router-dom';
export default function HeroSection() {
    const navigate = useNavigate();
    return(
        <section className='max-w-7xl mx-auto px-6 min-h-[70vh] flex items-center'>
            <div className= " flex flex-col lg:flex-row items-center gap-12">

                <div className = " flex-1">

                    <h1 className = "text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
                        Stop watching tutorials.
                        <br />
                        <span className="text-primary">
                            Build real apps
                        </span>
                        <br />
                        with an AI mentor.
                    </h1>

                    <Button variant = "primary" onClick={() => navigate(PATHS.DASHBOARD)} className="mt-10 !w-auto inline-flex items-center gap-2 px-5 py-2 rounded-xl hover:scale-105">
                        Start your first project
                        <ArrowRight size={18} />
                    </Button>
                </div>

                <div className = "flex-1">
                    <img src={Hero} className="w-full scale-110" />
                </div>
            </div>
        </section>
    );
}