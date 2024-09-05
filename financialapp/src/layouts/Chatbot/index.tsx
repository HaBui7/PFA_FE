"use client";

import * as React from "react";
import { TrendingUp, Settings, Send, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Chatbot() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Powered by RMIT Val</h1>
          <p className="text-gray-500">Model: GPT-4o</p>
          <p className="text-sm text-gray-400 mt-4">
            Disclaimer: We utilize your data in our services to process and
            provide advice. By using our services, you consent to this use of
            your data.
          </p>
        </div>
      </main>

      {/* Example Questions */}
      <section className="flex flex-col items-center px-8 pb-8 text-black">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 w-full max-w-4xl">
          <Button className="p-6 border border-gray-300 rounded-2xl bg-white text-left ">
            <span className="block text-base font-semibold leading-tight">
              Analyze my spending habits.
              <br />
              <span className="text-sm font-normal text-gray-500">
                and help me minimize expenses for next week?
              </span>
            </span>
          </Button>
          <Button className="p-6 border border-gray-300 rounded-2xl bg-white text-left">
            <span className="block text-base font-semibold leading-tight">
              Can I set up a tax-free saving account?
              <br />
              <span className="text-sm font-normal text-gray-500">
                in Australia as a non-citizen
              </span>
            </span>
          </Button>
          <Button className="p-6 border border-gray-300 rounded-2xl bg-white text-left">
            <span className="block text-base font-semibold leading-tight">
              What is down payment?
              <br />
              <span className="text-sm font-normal text-gray-500">etc...</span>
            </span>
          </Button>
          <Button className="p-6 border border-gray-300 rounded-2xl bg-white text-left">
            <span className="block text-base font-semibold leading-tight">
              Analyze my spending habits.
              <br />
              <span className="text-sm font-normal text-gray-500">
                and help me minimize expenses for next week?
              </span>
            </span>
          </Button>
        </div>
        <div className="mt-8 w-full max-w-2xl">
          <Input
            placeholder="Ask me anything..."
            className="rounded-full px-4 py-3 shadow-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-4 justify-center">
          <Button className="p-4 border border-gray-300 rounded-full bg-white shadow-md">
            <Send className="h-5 w-5 text-gray-500" />
          </Button>
          <Button className="p-4 border border-gray-300 rounded-full bg-white shadow-md">
            <RefreshCw className="h-5 w-5 text-gray-500" />
          </Button>
          <Button className="p-4 border border-gray-300 rounded-full bg-white shadow-md">
            <Settings className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Generated by generative AI. Responses may be irrelevant or misleading.
        </p>
      </section>
    </div>
  );
}
