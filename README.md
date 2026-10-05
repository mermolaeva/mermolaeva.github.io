# mermolaeva.github.io

Source for the personal website at <https://mermolaeva.com>.

The site is built with Jekyll and the Minimal Mistakes remote theme, pinned in
`_config.yml`. Site content lives in `index.md` and `_pages/`; navigation is in
`_data/navigation.yml`; the small visual customization layer is in
`assets/css/main.scss`.

## Local setup

Native Ruby extensions require the Ruby development headers. On Debian or
Ubuntu, install them with `sudo apt install ruby-dev` if they are not already
available.

Install the Ruby dependencies:

```sh
bundle config set --local path vendor/bundle
bundle install
```

Serve the site with the local URL override:

```sh
bundle exec jekyll serve --config _config.yml,_config_local.yml --destination _site_local
```

Then open <http://localhost:4000>. At minimum, check the home, projects,
teaching, CV, demos, MG Constructor, and 404 pages at desktop and mobile widths.

The repository intentionally does not vendor the theme's layouts, includes,
Sass partials, or JavaScript. Site-specific overrides should remain small so a
future theme update is normally limited to changing the pinned version and
checking the rendered site.
