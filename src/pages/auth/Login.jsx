import { MdEmail } from "react-icons/md";
import { FaLock, FaEye, FaGoogle, FaSignInAlt, FaScroll } from "react-icons/fa";
import { GiEgyptianProfile, GiEgyptianTemple } from "react-icons/gi";
import { FaShip } from "react-icons/fa6";
import { Link } from "react-router-dom";


export default function Login() {

    return (

        <section className="login-page flex min-h-screen bg-[#fffaec]">



            {/* Left Section  */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-[#844c0e] px-10 py-15">


                <div className="flex flex-col items-center mb-10">

                    <GiEgyptianProfile size={100} className="text-[#f7b825]" />
                    <h1 className="text-5xl xl:text-6xl text-white font-bold text-center pb-4">Mystic Egypt Tours</h1>
                    <div className="h-[3px] w-56 my-3 bg-linear-to-r from-[#d4af3707] via-[#f7b825] to-[#d4af3700]"></div>
                    <p className="text-xl text-[#efddaf] font-medium italic">Journey Through Millennia</p>

                </div>


                <div className="flex flex-col items-center space-y-8 w-full">


                    <div className="bg-[#8f5927] border border-[#f7b825] rounded-xl p-6 flex gap-4 w-[80%] ">

                        <GiEgyptianTemple size={35} className="text-[#f7b825]" />
                        <div>
                            <h3 className="text-3xl text-white font-bold">Ancient Wonders</h3>
                            <p className="text-lg text-[#efddaf]">Explore the magnificent pyramids, temples, and tombs that have stood for thousands of years.</p>
                        </div>

                    </div>


                    <div className="bg-[#8f5927] border border-[#f7b825] rounded-xl p-6 flex gap-4 w-[80%] ">

                        <FaScroll size={35} className="text-[#f7b825]" />
                        <div>
                            <h3 className="text-3xl text-white font-bold">Expert Guides</h3>
                            <p className="text-lg text-[#efddaf]">Learn from Egyptologists who bring ancient history to life with captivating stories.</p>
                        </div>

                    </div>


                    <div className="bg-[#8f5927] border border-[#f7b825] rounded-xl p-6 flex gap-4 w-[80%] ">

                        <FaShip size={35} className="text-[#f7b825]" />
                        <div>
                            <h3 className="text-3xl text-white font-bold">Nile Cruises</h3>
                            <p className="text-lg text-[#efddaf] ">Sail the legendary Nile River in luxury while visiting historical sites along the way.</p>
                        </div>

                    </div>



                </div>


                <div className="flex items-center space-x-10 mt-10">

                    <div className="text-center font-bold">
                        <h4 className="text-[#f7b825] text-4xl">5000+</h4>
                        <p className="text-[#efddaf] text-sm">Happy Travelers</p>
                    </div>

                    <div className="w-px h-10 bg-[#f7b825]/40"></div>

                    <div className="text-center font-bold">
                        <h4 className="text-[#f7b825] text-4xl">150+</h4>
                        <p className="text-[#efddaf] text-sm">Tour Packages</p>
                    </div>

                    <div className="w-px h-10 bg-[#f7b825]/40"></div>

                    <div className="text-center font-bold">
                        <h4 className="text-[#f7b825] text-4xl">25+</h4>
                        <p className="text-[#efddaf] text-sm">Years Experience</p>
                    </div>

                </div>

            </div>






            {/* Right Section */}
            <div className="w-full lg:w-1/2 flex justify-center items-center px-4 sm:px-6 md:px-10 py-8 sm:py-12">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">


                    <div className="flex flex-col items-center pb-6">

                        <div className="bg-[#ce9817] p-4 sm:p-5 rounded-full shadow-2xl animate-bounce">
                            <GiEgyptianProfile className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-4xl lg:text-6xl text-center font-bold mt-4"> WELCOME BACK</h2>
                        <p className="text-xs sm:text-sm md:text-base text-gray-500 italic text-center">Continue Your Journey</p>
                    </div>


                    {/* Form Container */}

                    <div className="bg-white p-4 sm:p-8 md:p-12 rounded-lg shadow-xl border-t-4 border-[#ce9817]">


                        <form className="space-y-4 sm:space-y-5">


                            <div>
                                <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                                    <MdEmail className="text-[#ce9817] w-4 h-4 sm:w-5 sm:h-5" />
                                    Email address
                                </label>
                                <input className="mt-2 w-full border border-gray-300 rounded-md px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm placeholder-gray-400 focus:ring-1 focus:ring-[#ce9817] focus:outline-[#ce9817] " placeholder="your.email@example.com" />
                            </div>



                            <div>
                                <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                                    <FaLock className="text-[#ce9817] w-4 h-4 sm:w-5 sm:h-5" />Password</label>
                                <div className="relative mt-2">
                                    <input type="password" className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm placeholder-gray-400 focus:ring-1 focus:ring-[#ce9817] focus:outline-[#ce9817]" placeholder="Enter your password" />
                                    <FaEye className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ce9817] w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                                </div>
                                <p className="text-[#ce9817] hover:text-[#a77407] cursor-pointer font-bold mt-1 text-end text-xs sm:text-sm">Forgot Password?</p>
                            </div>



                            <button type="submit" className="w-full flex justify-center items-center gap-1 sm:gap-2 cursor-pointer
                             bg-linear-to-r from-[#d4af37] to-[#ca8a04] hover:bg-linear-to-r hover:from-[#ca8a04] hover:to-[#d4af37] text-white text-xs sm:text-lg px-2 sm:px-4 py-2 sm:py-4 
                             rounded-md font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-600">
                                <FaSignInAlt /> Sign In
                            </button>


                            <div className="pt-4 text-center">
                                <div className="flex items-center text-gray-400 mb-4">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="px-2 text-sm ">Or</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>
                                <button className=" continue-btn w-full flex items-center justify-center gap-2 border border-[#ce9817] hover:bg-[#ecb53f74]  hover:text-white cursor-pointer transition-all duration-75 text-gray-500 font-bold px-2  sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm">
                                    Continue with Google <FaGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>

                        </form>


                        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-lg text-gray-500">Don't have an account?
                            <Link to="/register" className="font-bold text-[#ce9817] hover:text-[#a77407]" >
                                Create Account
                            </Link>
                        </p>

                    </div>
                </div>
            </div>

        </section>
    );
}
