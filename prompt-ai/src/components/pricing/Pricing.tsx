"use client";
import React from "react";

function Pricing() {
  const handleGetStarted = () => {
    window.location.href = "/SignUp";
  };

  return (
    <div className="relative isolate bg-white px-6 py-20 sm:py-10 lg:px-8">
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="mx-auto aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9%",
          }}
        ></div>
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base/7 font-semibold text-promptsmith-purple">
          Pricing
        </h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
          Choose the right plan for you
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl/8">
        Choose an affordable plan that&apos;s packed with the best features for
        engaging your audience, creating customer loyalty, and driving sales.
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        <div className="rounded-3xl rounded-t-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-tr-none lg:rounded-bl-3xl">
          <h3
            id="tier-hobby"
            className="text-base/7 font-semibold text-promptsmith-purple"
          >
            Hobby
          </h3>
          <p className="mt-4 flex items-baseline gap-x-2">
            <span className="text-5xl font-semibold tracking-tight text-gray-900">
              $0
            </span>
            <span className="text-base text-gray-500">/month</span>
          </p>
          <p className="mt-6 text-base/7 text-gray-600">
            The perfect plan if you&#039;re just getting started with our
            product.
          </p>
          <ul
            role="list"
            className="mt-8 space-y-3 text-sm/6 text-gray-600 sm:mt-10"
          >
            <li className="flex gap-x-3">
              <svg
                className="h-6 w-5 flex-none text-promptsmith-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              5 requests per day
            </li>
            <li className="flex gap-x-3">
              <svg
                className="h-6 w-5 flex-none text-promptsmith-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Up to 10,000 requests per month
            </li>
            <li className="flex gap-x-3">
              <svg
                className="h-6 w-5 flex-none text-promptsmith-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Advanced analytics (coming soon)
            </li>
            <li className="flex gap-x-3">
              <svg
                className="h-6 w-5 flex-none text-promptsmith-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              24-hour support response time (coming soon)
            </li>
          </ul>
          <button
            onClick={handleGetStarted}
            aria-describedby="tier-hobby"
            className="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-promptsmith-purple ring-1 ring-indigo-200 ring-inset
          "
          >
            Get started today
          </button>
        </div>
        <div className="relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
          <h3
            id="tier-enterprise"
            className="text-base/7 font-semibold text-promptsmith-purple"
          >
            Enterprise
          </h3>
          <p className="mt-4 flex items-baseline gap-x-2">
            <span className="text-5xl font-semibold tracking-tight text-white">
              $20
            </span>
            <span className="text-base text-gray-400">/month</span>
          </p>
          <p className="mt-6 text-base/7 text-gray-300">
            Dedicated support and infrastructure for your company.
          </p>
          <ul
            role="list"
            className="mt-8 space-y-3 text-sm/6 text-gray-300 sm:mt-10"
          >
            <li className="flex gap-x-3">
              <svg
                className="h-6 w-5 flex-none text-promptsmith-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Unlimited requests per month
            </li>
            <li className="flex gap-x-3">
              <svg
                className="h-6 w-5 flex-none text-promptsmith-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Unlimited requests per month
            </li>
            <li className="flex gap-x-3">
              <svg
                className="h-6 w-5 flex-none text-promptsmith-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Advanced analytics (coming soon)
            </li>
            <li className="flex gap-x-3">
              <svg
                className="h-6 w-5 flex-none text-promptsmith-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Dedicated support representative (coming soon)
            </li>
            <li className="flex gap-x-3">
              <svg
                className="h-6 w-5 flex-none text-promptsmith-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Marketing automations (coming soon)
            </li>
            <li className="flex gap-x-3">
              <svg
                className="h-6 w-5 flex-none text-promptsmith-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Custom integrations (coming soon)
            </li>
          </ul>
          <button
            onClick={handleGetStarted}
            aria-describedby="tier-enterprise"
            className="mt-8 block rounded-md bg-promptsmith-purple px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-promptsmith-purple/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-promptsmith-purple sm:mt-10"
          >
            Get started today
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
