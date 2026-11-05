import { Link } from 'react-router';
import { ArrowIcon } from '../components/Icons';
import { Meta } from '../components/Meta';

export default function NotFound() {
  return (
    <>
      <Meta title="Page not found" />
      <section className="page-hero notfound">
        <div className="wrap">
          <p className="eyebrow">Error 404</p>
          <h1 className="page-hero__title page-hero__title--xl">
            Failed <span className="striped">rep.</span>
          </h1>
          <p className="lede">This page doesn't exist, or it got re-racked somewhere else.</p>
          <div className="hero__ctas">
            <Link to="/" className="btn">
              Back to home <ArrowIcon />
            </Link>
            <Link to="/shop" className="btn btn--ghost">
              Shop the drop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
