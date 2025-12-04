
const DestinationsHero = () => {
  return (
    <div className="mb-16 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side  */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-6">
            <span className="text-xl">🌍</span>
            <span className="text-sm font-medium text-text">Curated Travel Location</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-text">
            Explore Egypt's
            <br />
            <span className="bg-linear-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              Top Destinations
            </span>
          </h1>

          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            From the Mediterranean coast to the banks of the Nile. Browse our
            comprehensive guide to Egypt's most breathtaking cities, regions,
            and hidden gems.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
              <span className="text-2xl">🏙️</span>
              <div>
                <p className="text-xs text-text-muted">Browse</p>
                <p className="font-bold text-text">20+ Cities</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
              <span className="text-2xl">🗺️</span>
              <div>
                <p className="text-xs text-text-muted">Regions</p>
                <p className="font-bold text-text">5 Unique Zones</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
              <span className="text-2xl">✨</span>
              <div>
                <p className="text-xs text-text-muted">Experiences</p>
                <p className="font-bold text-text">Unlimited</p>
              </div>
            </div>
          </div>
        </div>


        {/* Right Side*/}
        <div className="grid grid-cols-2 gap-4">

          <div className="col-span-2 bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary transition-all group cursor-pointer">
            <div className="relative h-64 bg-linear-to-br from-primary/30 via-secondary/20 to-tertiary/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl transform transition-transform duration-700 group-hover:scale-110 opacity-80">
                  🏝️
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-surface/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-text mb-1">Coastal Escapes</h3>
                <p className="text-sm text-text-secondary">Red Sea & Mediterranean</p>
              </div>
            </div>
          </div>


          <div className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary transition-all group cursor-pointer">
            <div className="relative h-48 bg-linear-to-br from-secondary/40 via-tertiary/30 to-border/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl transform transition-transform duration-700 group-hover:scale-110 opacity-80">
                  🏜️
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-surface/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold text-text">Desert Safari</h3>
                <p className="text-xs text-text-secondary">Siwa & White Desert</p>
              </div>
            </div>
          </div>


          <div className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary transition-all group cursor-pointer">
            <div className="relative h-48 bg-linear-to-br from-tertiary/40 via-border/30 to-primary/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl transform transition-transform duration-700 group-hover:scale-110 opacity-80">
                  🏺
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-surface/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold text-text">Cultural Hubs</h3>
                <p className="text-xs text-text-secondary">Luxor & Aswan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationsHero;