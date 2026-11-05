import { Link } from 'react-router';
import ironTexture from '../assets/iron-texture.png';
import { ArrowIcon } from '../components/Icons';
import { Meta } from '../components/Meta';
import { WeightPlate } from '../components/WeightPlate';

const CODE = [
  ['Re-rack your weights.', 'Every plate, every time. The next person shouldn’t have to strip your leg press.'],
  ['Wipe the bench.', 'Leave the bench cleaner than you found it.'],
  ['Don’t curl in the squat rack.', 'Unless it’s 5:45 a.m. and the gym is empty. Then do what you want.'],
  ['Log your fuel.', 'Training is half the job. The other half is what you eat.'],
  ['Show up on Monday.', 'And Tuesday. Consistency beats intensity, every single time.'],
  ['Spot the new guy.', 'Everyone was new once. Help them out.'],
];

export default function About() {
  return (
    <>
      <Meta
        title="About"
        description="Gymaholic started as a meal tracker built between sets. Now it's apparel and lifting gear for people who plan their week around the gym."
      />
      <section className="page-hero about-hero">
        <div className="hero__texture" style={{ backgroundImage: `url(${ironTexture})` }} aria-hidden="true" />
        <div className="wrap">
          <p className="eyebrow">Our story</p>
          <h1 className="page-hero__title page-hero__title--xl">
            Built <span className="striped">between</span>
            <br />
            sets.
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap story">
          <div className="story__plate">
            <WeightPlate label="EST" />
          </div>
          <div className="story__copy">
            <p className="story__lead">
              Gymaholic started in 2021 as a calorie tracker, a small side project typed out on a phone
              between sets of squats.
            </p>
            <p>
              The idea was simple. Every app we tried wanted a subscription, an account and our email
              before it would let us log a chicken breast. So we built our own. That tracker is still
              here, rebuilt as the <Link to="/fuel-log">Fuel Log</Link>: free, private and still
              without a paywall.
            </p>
            <p>
              The gear came next. We wanted tees that didn't go see-through after a month of deadlifts,
              a belt that didn't cost a week's rent, and straps that held up. We couldn't find all of it
              in one place, so we started making it.
            </p>
            <p>
              Everything we sell gets tested in a real gym first: chalk, sweat, the 5 a.m. walk in. If it
              doesn't survive that, we don't sell it.
            </p>
            <Link to="/shop" className="btn">
              Shop the gear <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="section code" id="code">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">House rules</p>
              <h2>The Gymaholic Code</h2>
            </div>
          </div>
          <ol className="code__list">
            {CODE.map(([rule, note], i) => (
              <li key={rule}>
                <span className="code__n mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="code__rule">{rule}</span>
                <span className="code__note">{note}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
