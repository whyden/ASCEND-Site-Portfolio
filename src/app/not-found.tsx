import { TransitionLink } from "@/components/fx/TransitionLink";

export default function NotFound() {
  return (
    <main className="not-found tone-dark">
      <div className="wrap">
        <h1 className="t-section">Такой страницы нет.</h1>
        <TransitionLink href="/" className="btn">
          <span>На главную</span>
        </TransitionLink>
      </div>
    </main>
  );
}
