import React from "react";
import image1 from "./image-1.png";
import image13 from "./image-13.png";
import image14 from "./image-14.png";

export const Frame = () => {
  return (
    <div className="w-full min-w-[1920px] min-h-[1080px] flex">
      <div className="w-[1920px] h-[1080px] relative bg-[linear-gradient(150deg,rgba(10,10,10,1)_0%,rgba(0,0,0,1)_100%)]">
        <img
          className="absolute top-[59px] left-[54px] w-[282px] h-[85px] aspect-[3.31] object-cover"
          alt="Image"
          src={image13}
        />

        <img
          className="absolute top-[152px] left-[45px] w-[1351px] h-[900px] aspect-[1.5] object-cover"
          alt="Image"
          src={image14}
        />

        <div className="absolute top-[130px] left-[1085px] w-[700px] h-[850px] rounded-[50px] border-[none] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] bg-[linear-gradient(145deg,rgba(244,244,244,0.4)_0%,rgba(244,244,244,0.2)_100%)] before:content-[''] before:absolute before:inset-0 before:p-[3px] before:rounded-[50px] before:[background:linear-gradient(146deg,rgba(244,244,244,0.6)_0%,rgba(244,244,244,0.4)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none" />

        <div className="flex flex-col max-w-[2000px] w-[712px] h-[938px] items-center justify-center gap-6 absolute top-[calc(50.00%_-_426px)] left-[1079px] bg-[#0d0b0ba6]">
          <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-center relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative flex items-center justify-center self-stretch mt-[-1.00px] [font-family:'Moul-Regular',Helvetica] font-normal text-[#c53030] text-4xl text-center tracking-[0] leading-[25.6px]">
                Welcome back!
              </div>
            </div>
          </div>

          <div className="flex flex-col w-[528px] h-[549px] items-center gap-[25px] p-[25px] relative bg-black rounded-[50px] border border-solid border-neutral-800 shadow-[0px_10px_25px_#0000004c]">
            <div className="flex w-[400px] items-start justify-center p-1 relative flex-[0_0_auto] bg-neutral-900 rounded-lg">
              <button className="all-[unset] box-border flex flex-col items-center justify-center px-4 py-2 relative flex-1 grow bg-[#c53030] rounded">
                <div className="text-white text-[12.8px] relative flex items-center justify-center self-stretch mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-center tracking-[0] leading-[normal]">
                  Sign In
                </div>
              </button>

              <button className="all-[unset] box-border flex flex-col px-4 py-2 relative flex-1 grow rounded items-center justify-center">
                <div className="text-neutral-400 text-[12.7px] relative flex items-center justify-center self-stretch mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-center tracking-[0] leading-[normal]">
                  Sign Up
                </div>
              </button>
            </div>

            <div className="flex flex-col w-[550px] items-center gap-4 pt-0 pb-[23.99px] px-0 relative flex-[0_0_auto] ml-[-36.00px] mr-[-36.00px]">
              <div className="flex flex-col w-[400px] items-center gap-2 relative flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <label
                    className="relative flex items-center justify-center self-stretch mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-white text-sm tracking-[0] leading-[22.4px]"
                    htmlFor="input-1"
                  >
                    Email
                  </label>
                </div>

                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start justify-center pl-[41px] pr-[13px] py-[13px] relative self-stretch w-full flex-[0_0_auto] bg-neutral-900 rounded-lg overflow-hidden border border-solid border-neutral-800">
                    <input
                      className="w-[344px] pt-0 pb-px px-0 relative border-[none] [background:none] text-[15.2px] mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#757575] tracking-[0] leading-[normal] whitespace-nowrap"
                      id="input-1"
                      placeholder="Enter your email"
                      type="email"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-[8.01px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col w-[400px] items-center relative flex-[0_0_auto]">
                  <div className="relative flex items-center justify-center self-stretch mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-white text-[13.9px] tracking-[0] leading-[22.4px]">
                    Password
                  </div>
                </div>

                <div className="flex flex-col w-[400px] items-start relative flex-[0_0_auto]">
                  <div className="flex items-start justify-center pl-[41px] pr-[13px] py-[13px] relative self-stretch w-full flex-[0_0_auto] bg-neutral-900 rounded-lg overflow-hidden border border-solid border-neutral-800">
                    <div className="flex flex-col w-[344px] items-start pt-0 pb-px px-0 relative">
                      <div className="text-[15px] relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#757575] tracking-[0] leading-[normal] whitespace-nowrap">
                        Enter your password
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex flex-col h-[53.74%] p-1 absolute top-[23.33%] right-[13px] rounded items-center justify-center">
                    <div className="relative flex items-center justify-center w-fit mt-[-0.91px] mr-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-neutral-400 text-[13.3px] text-center tracking-[0] leading-[normal]">
                      
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-[400px] items-center justify-between relative flex-[0_0_auto]">
                <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                  <div className="relative w-4 h-4 bg-white rounded-[2.5px] border border-solid border-[#767676]" />

                  <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                    <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[22.4px] whitespace-nowrap">
                      Remember me
                    </div>
                  </div>
                </div>

                <div className="flex-col inline-flex items-start relative flex-[0_0_auto]">
                  <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-[#c53030] text-sm tracking-[0] leading-[22.4px] whitespace-nowrap">
                    Forgot password?
                  </div>
                </div>
              </div>

              <button className="all-[unset] box-border flex w-[400px] pt-3 pb-[13px] px-3 relative flex-[0_0_auto] bg-[#c53030] rounded-lg items-center justify-center">
                <div className="relative flex items-center justify-center flex-1 mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-base text-center tracking-[0] leading-[normal]">
                  Sign In
                </div>
              </button>
            </div>

            <div className="flex flex-col w-[400px] items-start relative flex-[0_0_auto] bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
              <div className="relative self-stretch w-full h-px bg-neutral-800" />

              <div className="flex flex-col w-[30.67%] h-[2239.00%] items-start px-3 py-0 absolute top-[-1070.00%] left-[34.67%] bg-neutral-950">
                <div className="relative [display:-webkit-box] items-center justify-center w-fit mt-[-1.00px] mr-[-0.33px] [font-family:'Roboto-Regular',Helvetica] font-normal text-neutral-400 text-[13.8px] tracking-[0] leading-[22.4px] whitespace-nowrap overflow-hidden text-ellipsis [-webkit-line-clamp:0] [-webkit-box-orient:vertical]">
                  or continue with
                </div>
              </div>
            </div>

            <div className="flex flex-col w-[550px] h-11 items-center gap-3 relative ml-[-36.00px] mr-[-36.00px]">
              <button className="all-[unset] box-border flex w-[400px] h-[68px] gap-[8.01px] p-[13px] relative mb-[-24.00px] rounded-lg border border-solid border-neutral-800 items-center justify-center">
                <div className="relative flex items-center justify-center w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[15px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  Continue with Google
                </div>
              </button>
            </div>

            <div className="flex w-[550px] items-start justify-center relative flex-[0_0_auto] mb-[-2.00px] ml-[-36.00px] mr-[-36.00px]">
              <div className="relative flex items-center justify-center w-[168px] mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-neutral-400 text-base text-center tracking-[0] leading-[25.6px]">
                Don&#39;t have an account?
              </div>

              <div className="justify-center ml-[-5.68e-14px] inline-flex items-start relative flex-[0_0_auto]">
                <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-[#c53030] text-base text-center tracking-[0] leading-[25.6px] whitespace-nowrap">
                  Sign up
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-[17px] items-start justify-center relative self-stretch w-full">
            <p className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-neutral-400 text-xs text-center tracking-[0] leading-[16.8px] whitespace-nowrap">
              By continuing, you agree to our
            </p>

            <div className="inline-flex items-start justify-center relative flex-[0_0_auto]">
              <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-[#c53030] text-[11.8px] text-center tracking-[0] leading-[16.8px] whitespace-nowrap">
                Terms of Service
              </div>
            </div>

            <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-neutral-400 text-xs text-center tracking-[0] leading-[16.8px] whitespace-nowrap">
              {" "}
              and
            </div>

            <div className="inline-flex items-start justify-center relative flex-[0_0_auto]">
              <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-[#c53030] text-xs text-center tracking-[0] leading-[16.8px] whitespace-nowrap">
                Privacy Policy
              </div>
            </div>
          </div>

          <div className="relative w-[1750px] h-5 ml-[-519.00px] mr-[-519.00px]" />
        </div>

        <div className="absolute top-[734px] left-[1286px] w-10 h-10 flex bg-white rounded-[20px] shadow-[0px_4px_4px_#00000040]">
          <img
            className="mt-[5px] w-[30px] h-[30px] ml-[5px] object-cover"
            alt="Image"
            src={image1}
          />
        </div>
      </div>
    </div>
  );
};
