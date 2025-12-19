import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, Headset } from "lucide-react";
import fashionImage from "../assets/hannah-morgan-ycVFts5Ma4s-unsplash.jpg";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 z-0">
          <img
            src={fashionImage}
            alt="Fashion Model"
            className="w-full h-full object-cover scale-105 transition-transform duration-[20s] hover:scale-110 ease-linear"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-10">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold tracking-wider mb-4 border border-blue-500/30 backdrop-blur-md">
              NEW COLLECTION 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-xl">
              Discover Your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
                True Style
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
              Experience fashion that speaks without words. Premium quality,
              sustainable materials, and designs that turn heads.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="group relative px-8 py-4 bg-white text-slate-900 font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Collection
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                to="/about"
                className="px-8 py-4 bg-transparent border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose D-SHOP?
            </h2>
            <p className="text-slate-600">
              We prioritize your experience. From checkout to delivery, we
              ensure seamless service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 text-blue-600">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                Lightning Fast
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Order today, wear it soon. We offer expedited shipping options
                worldwide within 2-3 days.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 text-emerald-600">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                Secure Payments
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Shop with confidence. Your data is encrypted with 256-bit SSL
                technology.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 text-purple-600">
                <Headset className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                24/7 Support
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Have questions? Our support team is ready to help you anytime,
                day or night.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;