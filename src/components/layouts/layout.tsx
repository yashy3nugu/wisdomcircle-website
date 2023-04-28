import React from "react";
import Company from "../icons/company";
import Divider from "../icons/divider";
import Turtle from "../icons/turtle";
const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main>
        <div className="flex h-full flex-col items-center justify-center">
          <div className="grid h-full w-full md:grid-cols-5">
            <div className="hidden justify-center md:col-span-2 md:flex">
              <div className="relative flex h-screen flex-col items-center justify-center bg-brandgray text-white">
                <div className="flex h-full items-center">
                  <div className="h-40 w-40 lg:h-52 lg:w-52">
                    <Company />
                  </div>
                </div>
                <div className="static bottom-0 grid grid-cols-4">
                  <div className="col-span-1 mt-28">
                    <Turtle />
                  </div>
                  <div className="col-span-3 px-4 xl:px-10">
                    <p className="mb-5 text-lg font-semibold lg:text-xl lg:font-bold xl:text-2xl">
                      Welcome Back!
                    </p>
                    <p className="text-sm font-light lg:text-base lg:font-normal">
                      Sign In to find opportunities that match your interests.
                      We have both part-time and full-time roles that can be
                      done online and in-person.
                    </p>

                    <div className="mt-6">
                      <div>
                        <Divider />
                      </div>
                    </div>
                    <p className="mt-20 text-xs">
                      Please contact us at{" "}
                      <span className="font-semibold">+91-9380644532</span> if
                      you need any assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 flex h-full w-full flex-col md:col-span-3 md:flex-row md:justify-center">
              {children}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Layout;
