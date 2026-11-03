import { Link } from "react-router-dom";
import { BookButton } from "@/components/cta/Actions";
import { PathPicker } from "@/components/blocks/Sales";

export default function NotFound() {
  return (
    <section className="pb-16 pt-32">
      <div className="container-x">
        <p className="font-display text-sm font-bold text-turbo">404</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-6xl">That page doesn't exist.</h1>
        <p className="lede">It may have moved. Pick where you were headed, or go back to the homepage.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="btn-chrome">
            Homepage
          </Link>
          <BookButton note="404 page" />
        </div>
        <div className="mt-16">
          <PathPicker />
        </div>
      </div>
    </section>
  );
}

export function PromptShop() {
  return (
    <section className="pb-16 pt-32">
      <div className="container-x max-w-3xl">
        <p className="chip">Coming soon</p>
        <h1 className="mt-5 text-4xl font-bold sm:text-6xl">Prompt Shop</h1>
        <p className="lede">Battle-tested AI prompts for content, outreach and operations, stock and crypto scanners, and launch-ready site templates for personal brands. Join the Discord to hear first when it opens.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="https://discord.gg/5zYWSWGMYm" target="_blank" rel="noopener" className="btn-chrome">
            Join the Discord
          </a>
          <BookButton note="Prompt Shop page">Need it done for you? Book a call</BookButton>
        </div>
      </div>
    </section>
  );
}
