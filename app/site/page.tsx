import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards } from "@/lib/constant";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { features } from "process";

const Home = () => {
  return (
    <>
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 pt-24 overflow-hidden">

        <div
          className="absolute inset-0
          bg-[linear-gradient(to_right,rgba(88,91,112,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(88,91,112,0.22)_1px,transparent_1px)]
          bg-[size:4rem_4rem]
          [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_60%,transparent_120%)]"
        />

        <p className="relative z-10 text-lg md:text-2xl text-center mb-1 tracking-wide">
          Run your agency, in one place
        </p>

        <div className="relative z-10 bg-gradient-to-r from-sky-600 via-blue-500 to-blue-300 bg-clip-text text-transparent">
          <h1 className="text-[64px] sm:text-[120px] md:text-[200px] font-extrabold leading-none tracking-tight text-center">
            Nebulla
          </h1>
        </div>

        {/* Image, overlay */}
        <div className="relative z-10 flex justify-center items-center md:mt-[-40px]">
          <Image
            src="/preview.png"
            alt="banner image"
            height={1100}
            width={1100}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />

          <div className="absolute left-0 right-0 bottom-0 top-1/2 bg-gradient-to-t from-black/90 to-transparent z-20"></div>
        </div>

      </section>
      <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px]">
        <h2 className="text-4xl text-center">Choose what fits you right</h2>
        <p className="text-muted-foreground text-center">Our straight forward pricing plans are tailored to meet your needs. If {" you're"} not <br/>ready to commit you can start for free</p>
      </section>

      <div className="flex justify-center gap-6 flex-wrap mt-10 px-4 max-w-6xl mx-auto">
        {pricingCards.map((card) => {
          const isPopular = card.title === "Unlimited Saas";

          return (
            <Card
              key={card.title}
              className={clsx(
                "w-[300px] flex flex-col justify-between rounded-xl transition-all duration-300 shadow-sm",
                // Highlight the popular card
                isPopular
                  ? "border-primary border-2 shadow-primary/30"
                  : "border border-border hover:border-primary/40"
              )}
            >
              <CardHeader>
                <CardTitle
                  className={clsx(
                    "text-xl font-semibold",
                    !isPopular && "text-muted-foreground"
                  )}
                >
                  {card.title}
                </CardTitle>

                <CardDescription>
                  {card.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{card.price}</span>
                  <span className="text-muted-foreground">/m</span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col items-start gap-4">
                <div className="space-y-2">
                  {card.features.map((feature) => (
                    <div key={feature} className="flex gap-2 items-center">
                      <Check className="text-primary h-4 w-4" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
              </CardFooter>

              <Link
                href={`/agency?plan=${card.priceId}`}
                className={clsx(
                  "w-full text-center p-2 rounded-md font-medium mt-4 transition-all",
                  isPopular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                )}
              >
                Get Started
              </Link>
            </Card>
          );
        })}
      </div>

    </>
  );
};

export default Home;

