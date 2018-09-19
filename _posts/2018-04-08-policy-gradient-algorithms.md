





<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
  <link rel="dns-prefetch" href="https://assets-cdn.github.com">
  <link rel="dns-prefetch" href="https://avatars0.githubusercontent.com">
  <link rel="dns-prefetch" href="https://avatars1.githubusercontent.com">
  <link rel="dns-prefetch" href="https://avatars2.githubusercontent.com">
  <link rel="dns-prefetch" href="https://avatars3.githubusercontent.com">
  <link rel="dns-prefetch" href="https://github-cloud.s3.amazonaws.com">
  <link rel="dns-prefetch" href="https://user-images.githubusercontent.com/">



  <link crossorigin="anonymous" media="all" integrity="sha512-Z0JAar9+DkI1NjGVdZr3GivARUgJtA0o2eHlTv7Ou2gshR5awWVf8QGsq11Ns9ZxQLEs+G5/SuARmvpOLMzulw==" rel="stylesheet" href="https://assets-cdn.github.com/assets/frameworks-95aff0b550d3fe338b645a4deebdcb1b.css" />
  <link crossorigin="anonymous" media="all" integrity="sha512-C6N00W0iP2oB+7G1Ky/7vUewo8ZDLWvsP4jCxLh7Oh5WDWqzcWI2dc/rBQF/KUVgnlJgdnzx8Q7d14ukpUMIdA==" rel="stylesheet" href="https://assets-cdn.github.com/assets/github-485942f0765a59298868de83961beb76.css" />
  
  
  <link crossorigin="anonymous" media="all" integrity="sha512-d05UAE+XVkB/QcOlIoZG4baBjaFk7r0bxQsoMDA9YoDT6dANlLJWPUdm/SoxXImWvhlLa9sPgUy4wtTzU5rBww==" rel="stylesheet" href="https://assets-cdn.github.com/assets/site-1004791ce103b39207617406c2b25111.css" />
  

  <meta name="viewport" content="width=device-width">
  
  <title>lil-log/2018-04-08-policy-gradient-algorithms.md at master · lilianweng/lil-log · GitHub</title>
    <meta name="description" content="Lilian&#39;s Blog. Contribute to lilianweng/lil-log development by creating an account on GitHub.">
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub">
  <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub">
  <meta property="fb:app_id" content="1401488693436528">

    
    <meta property="og:image" content="https://avatars3.githubusercontent.com/u/901179?s=400&amp;v=4" /><meta property="og:site_name" content="GitHub" /><meta property="og:type" content="object" /><meta property="og:title" content="lilianweng/lil-log" /><meta property="og:url" content="https://github.com/lilianweng/lil-log" /><meta property="og:description" content="Lilian&#39;s Blog. Contribute to lilianweng/lil-log development by creating an account on GitHub." />

  <link rel="assets" href="https://assets-cdn.github.com/">
  
  <meta name="pjax-timeout" content="1000">
  
  <meta name="request-id" content="DFAC:6204:11B4465:196B022:5BA19340" data-pjax-transient>


  

  <meta name="selected-link" value="repo_source" data-pjax-transient>

      <meta name="google-site-verification" content="KT5gs8h0wvaagLKAVWq8bbeNwnZZK1r1XQysX3xurLU">
    <meta name="google-site-verification" content="ZzhVyEFwb7w3e0-uOTltm8Jsck2F5StVihD0exw2fsA">
    <meta name="google-site-verification" content="GXs5KoUUkNCoaAZn7wPN-t01Pywp9M3sEjnt_3_ZWPc">

  <meta name="octolytics-host" content="collector.githubapp.com" /><meta name="octolytics-app-id" content="github" /><meta name="octolytics-event-url" content="https://collector.githubapp.com/github-external/browser_event" /><meta name="octolytics-dimension-request_id" content="DFAC:6204:11B4465:196B022:5BA19340" /><meta name="octolytics-dimension-region_edge" content="sea" /><meta name="octolytics-dimension-region_render" content="iad" />
<meta name="analytics-location" content="/&lt;user-name&gt;/&lt;repo-name&gt;/blob/show" data-pjax-transient="true" />



    <meta name="google-analytics" content="UA-3769691-2">


<meta class="js-ga-set" name="dimension1" content="Logged Out">



  

      <meta name="hostname" content="github.com">
    <meta name="user-login" content="">

      <meta name="expected-hostname" content="github.com">
    <meta name="js-proxy-site-detection-payload" content="NGQyMjFkMmIxOWIyMzFlZWNjNGQxMjBkZjVjODQzMTFiZjk4OWExYzY5N2I3YzlhZTg2ZGUwOTU2MjViYmFiYXx7InJlbW90ZV9hZGRyZXNzIjoiMTIuMS43Mi40NCIsInJlcXVlc3RfaWQiOiJERkFDOjYyMDQ6MTFCNDQ2NToxOTZCMDIyOjVCQTE5MzQwIiwidGltZXN0YW1wIjoxNTM3MzE1NjQ5LCJob3N0IjoiZ2l0aHViLmNvbSJ9">

    <meta name="enabled-features" content="DASHBOARD_V2_LAYOUT_OPT_IN,EXPLORE_DISCOVER_REPOSITORIES,UNIVERSE_BANNER,MARKETPLACE_PLAN_RESTRICTION_EDITOR,QUOTE_MARKDOWN">

  <meta name="html-safe-nonce" content="311243d2b436fa70f26be0808d2f5ed9d6d5f532">

  <meta http-equiv="x-pjax-version" content="069fa7aa1a65c387901406ae33600fed">
  

      <link href="https://github.com/lilianweng/lil-log/commits/master.atom" rel="alternate" title="Recent Commits to lil-log:master" type="application/atom+xml">

  <meta name="go-import" content="github.com/lilianweng/lil-log git https://github.com/lilianweng/lil-log.git">

  <meta name="octolytics-dimension-user_id" content="901179" /><meta name="octolytics-dimension-user_login" content="lilianweng" /><meta name="octolytics-dimension-repository_id" content="95328922" /><meta name="octolytics-dimension-repository_nwo" content="lilianweng/lil-log" /><meta name="octolytics-dimension-repository_public" content="true" /><meta name="octolytics-dimension-repository_is_fork" content="false" /><meta name="octolytics-dimension-repository_network_root_id" content="95328922" /><meta name="octolytics-dimension-repository_network_root_nwo" content="lilianweng/lil-log" /><meta name="octolytics-dimension-repository_explore_github_marketplace_ci_cta_shown" content="false" />


    <link rel="canonical" href="https://github.com/lilianweng/lil-log/blob/master/_posts/2018-04-08-policy-gradient-algorithms.md" data-pjax-transient>


  <meta name="browser-stats-url" content="https://api.github.com/_private/browser/stats">

  <meta name="browser-errors-url" content="https://api.github.com/_private/browser/errors">

  <link rel="mask-icon" href="https://assets-cdn.github.com/pinned-octocat.svg" color="#000000">
  <link rel="icon" type="image/x-icon" class="js-site-favicon" href="https://assets-cdn.github.com/favicon.ico">

<meta name="theme-color" content="#1e2327">



  <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials">

  </head>

  <body class="logged-out env-production page-blob">
    

  <div class="position-relative js-header-wrapper ">
    <a href="#start-of-content" tabindex="1" class="px-2 py-4 bg-blue text-white show-on-focus js-skip-to-content">Skip to content</a>
    <div id="js-pjax-loader-bar" class="pjax-loader-bar"><div class="progress"></div></div>

    
    
    



        


  <header class="Header header-logged-out  position-relative f4 py-3" role="banner" >
    <div class="container-lg d-flex px-3">
      <div class="d-flex flex-justify-between flex-items-center">
        <a class="header-logo-invertocat my-0" href="https://github.com/" aria-label="Homepage" data-ga-click="(Logged out) Header, go to homepage, icon:logo-wordmark; experiment:site_header_dropdowns; group:control">
          <svg height="32" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
        </a>

      </div>

      <div class="HeaderMenu d-flex flex-justify-between flex-auto">
          <nav class="mt-0">
            <ul class="d-flex list-style-none">
                <li class="ml-2">
                  <a class="js-selected-navigation-item HeaderNavlink px-0 py-2 m-0" data-ga-click="Header, click, Nav menu - item:features; experiment:site_header_dropdowns; group:control" data-selected-links="/features /features/project-management /features/code-review /features/project-management /features/integrations /features" href="/features">
                    Features
</a>                </li>
                <li class="ml-4">
                  <a class="js-selected-navigation-item HeaderNavlink px-0 py-2 m-0" data-ga-click="Header, click, Nav menu - item:business; experiment:site_header_dropdowns; group:control" data-selected-links="/business /business/security /business/customers /business" href="/business">
                    Business
</a>                </li>

                <li class="ml-4">
                  <a class="js-selected-navigation-item HeaderNavlink px-0 py-2 m-0" data-ga-click="Header, click, Nav menu - item:explore; experiment:site_header_dropdowns; group:control" data-selected-links="/explore /trending /trending/developers /integrations /integrations/feature/code /integrations/feature/collaborate /integrations/feature/ship showcases showcases_search showcases_landing /explore" href="/explore">
                    Explore
</a>                </li>

                <li class="ml-4">
                      <a class="js-selected-navigation-item HeaderNavlink px-0 py-2 m-0" data-ga-click="Header, click, Nav menu - item:marketplace; experiment:site_header_dropdowns; group:control" data-selected-links=" /marketplace" href="/marketplace">
                        Marketplace
</a>                </li>
                <li class="ml-4">
                  <a class="js-selected-navigation-item HeaderNavlink px-0 py-2 m-0" data-ga-click="Header, click, Nav menu - item:pricing; experiment:site_header_dropdowns; group:control" data-selected-links="/pricing /pricing/developer /pricing/team /pricing/business-hosted /pricing/business-enterprise /pricing" href="/pricing">
                    Pricing
</a>                </li>
            </ul>
          </nav>

        <div class="d-flex">
            <div class="d-lg-flex flex-items-center mr-3">
              <div class="header-search scoped-search site-scoped-search js-site-search position-relative js-jump-to"
  role="combobox"
  aria-owns="jump-to-results"
  aria-label="Search or jump to"
  aria-haspopup="listbox"
  aria-expanded="false"
>
  <div class="position-relative">
    <!-- '"` --><!-- </textarea></xmp> --></option></form><form class="js-site-search-form" data-scope-type="Repository" data-scope-id="95328922" data-scoped-search-url="/lilianweng/lil-log/search" data-unscoped-search-url="/search" action="/lilianweng/lil-log/search" accept-charset="UTF-8" method="get"><input name="utf8" type="hidden" value="&#x2713;" />
      <label class="form-control header-search-wrapper header-search-wrapper-jump-to position-relative d-flex flex-justify-between flex-items-center js-chromeless-input-container">
        <input type="text"
          class="form-control header-search-input jump-to-field js-jump-to-field js-site-search-focus js-site-search-field is-clearable"
          data-hotkey="s,/"
          name="q"
          value=""
          placeholder="Search"
          data-unscoped-placeholder="Search GitHub"
          data-scoped-placeholder="Search"
          autocapitalize="off"
          aria-autocomplete="list"
          aria-controls="jump-to-results"
          data-jump-to-suggestions-path="/_graphql/GetSuggestedNavigationDestinations#csrf-token=ppwTGWohtqicgqWcYt7o8nnSZHS3z28RnvLOcSCmhl8Egi4iV5kBpr7yhFv3rWTNIZbC38zI6Dwmv27qUattfQ=="
          spellcheck="false"
          autocomplete="off"
          >
          <input type="hidden" class="js-site-search-type-field" name="type" >
            <img src="https://assets-cdn.github.com/images/search-shortcut-hint.svg" alt="" class="mr-2 header-search-key-slash">

            <div class="Box position-absolute overflow-hidden d-none jump-to-suggestions js-jump-to-suggestions-container">
              <ul class="d-none js-jump-to-suggestions-template-container">
                <li class="d-flex flex-justify-start flex-items-center p-0 f5 navigation-item js-navigation-item" role="option">
                  <a tabindex="-1" class="no-underline d-flex flex-auto flex-items-center p-2 jump-to-suggestions-path js-jump-to-suggestion-path js-navigation-open" href="">
                    <div class="jump-to-octicon js-jump-to-octicon mr-2 text-center d-none">
                      <svg height="16" width="16" class="octicon octicon-repo flex-shrink-0 js-jump-to-octicon-repo d-none" title="Repository" aria-label="Repository" viewBox="0 0 12 16" version="1.1" role="img"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"/></svg>
                      <svg height="16" width="16" class="octicon octicon-project flex-shrink-0 js-jump-to-octicon-project d-none" title="Project" aria-label="Project" viewBox="0 0 15 16" version="1.1" role="img"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"/></svg>
                      <svg height="16" width="16" class="octicon octicon-search flex-shrink-0 js-jump-to-octicon-search d-none" title="Search" aria-label="Search" viewBox="0 0 16 16" version="1.1" role="img"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0 0 13 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 0 0 0-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"/></svg>
                    </div>

                    <img class="avatar mr-2 flex-shrink-0 js-jump-to-suggestion-avatar d-none" alt="" aria-label="Team" src="" width="28" height="28">

                    <div class="jump-to-suggestion-name js-jump-to-suggestion-name flex-auto overflow-hidden text-left no-wrap css-truncate css-truncate-target">
                    </div>

                    <div class="border rounded-1 flex-shrink-0 bg-gray px-1 text-gray-light ml-1 f6 d-none js-jump-to-badge-search">
                      <span class="js-jump-to-badge-search-text-default d-none" aria-label="in this repository">
                        In this repository
                      </span>
                      <span class="js-jump-to-badge-search-text-global d-none" aria-label="in all of GitHub">
                        All GitHub
                      </span>
                      <span aria-hidden="true" class="d-inline-block ml-1 v-align-middle">↵</span>
                    </div>

                    <div aria-hidden="true" class="border rounded-1 flex-shrink-0 bg-gray px-1 text-gray-light ml-1 f6 d-none d-on-nav-focus js-jump-to-badge-jump">
                      Jump to
                      <span class="d-inline-block ml-1 v-align-middle">↵</span>
                    </div>
                  </a>
                </li>
              </ul>
              <ul class="d-none js-jump-to-no-results-template-container">
                <li class="d-flex flex-justify-center flex-items-center p-3 f5 d-none">
                  <span class="text-gray">No suggested jump to results</span>
                </li>
              </ul>

              <ul id="jump-to-results" role="listbox" class="js-navigation-container jump-to-suggestions-results-container js-jump-to-suggestions-results-container" >
                <li class="d-flex flex-justify-center flex-items-center p-0 f5">
                  <img src="https://assets-cdn.github.com/images/spinners/octocat-spinner-128.gif" alt="Octocat Spinner Icon" class="m-2" width="28">
                </li>
              </ul>
            </div>
      </label>
</form>  </div>
</div>

            </div>

          <span class="d-inline-block">
              <div class="HeaderNavlink px-0 py-2 m-0">
                <a class="text-bold text-white no-underline" href="/login?return_to=%2Flilianweng%2Flil-log%2Fblob%2Fmaster%2F_posts%2F2018-04-08-policy-gradient-algorithms.md" data-ga-click="(Logged out) Header, clicked Sign in, text:sign-in; experiment:site_header_dropdowns; group:control">Sign in</a>
                  <span class="text-gray">or</span>
                  <a class="text-bold text-white no-underline" href="/join?source=header-repo" data-ga-click="(Logged out) Header, clicked Sign up, text:sign-up; experiment:site_header_dropdowns; group:control">Sign up</a>
              </div>
          </span>
        </div>
      </div>
    </div>
  </header>

  </div>

  <div id="start-of-content" class="show-on-focus"></div>

    <div id="js-flash-container">


</div>



  <div role="main" class="application-main ">
        <div itemscope itemtype="http://schema.org/SoftwareSourceCode" class="">
    <div id="js-repo-pjax-container" data-pjax-container >
      







  <div class="pagehead repohead instapaper_ignore readability-menu experiment-repo-nav  ">
    <div class="repohead-details-container clearfix container">

      <ul class="pagehead-actions">
  <li>
      <a href="/login?return_to=%2Flilianweng%2Flil-log"
    class="btn btn-sm btn-with-count tooltipped tooltipped-s"
    aria-label="You must be signed in to watch a repository" rel="nofollow">
    <svg class="octicon octicon-eye v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"/></svg>
    Watch
  </a>
  <a class="social-count" href="/lilianweng/lil-log/watchers"
     aria-label="5 users are watching this repository">
    5
  </a>

  </li>

  <li>
      <a href="/login?return_to=%2Flilianweng%2Flil-log"
    class="btn btn-sm btn-with-count tooltipped tooltipped-s"
    aria-label="You must be signed in to star a repository" rel="nofollow">
    <svg class="octicon octicon-star v-align-text-bottom" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"/></svg>
    Star
  </a>

    <a class="social-count js-social-count" href="/lilianweng/lil-log/stargazers"
      aria-label="16 users starred this repository">
      16
    </a>

  </li>

  <li>
      <a href="/login?return_to=%2Flilianweng%2Flil-log"
        class="btn btn-sm btn-with-count tooltipped tooltipped-s"
        aria-label="You must be signed in to fork a repository" rel="nofollow">
        <svg class="octicon octicon-repo-forked v-align-text-bottom" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"/></svg>
        Fork
      </a>

    <a href="/lilianweng/lil-log/network/members" class="social-count"
       aria-label="6 users forked this repository">
      6
    </a>
  </li>
</ul>

      <h1 class="public ">
  <svg class="octicon octicon-repo" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"/></svg>
  <span class="author" itemprop="author"><a class="url fn" rel="author" href="/lilianweng">lilianweng</a></span><!--
--><span class="path-divider">/</span><!--
--><strong itemprop="name"><a data-pjax="#js-repo-pjax-container" href="/lilianweng/lil-log">lil-log</a></strong>

</h1>

    </div>
    
<nav class="reponav js-repo-nav js-sidenav-container-pjax container"
     itemscope
     itemtype="http://schema.org/BreadcrumbList"
     role="navigation"
     data-pjax="#js-repo-pjax-container">

  <span itemscope itemtype="http://schema.org/ListItem" itemprop="itemListElement">
    <a class="js-selected-navigation-item selected reponav-item" itemprop="url" data-hotkey="g c" data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches repo_packages /lilianweng/lil-log" href="/lilianweng/lil-log">
      <svg class="octicon octicon-code" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9.5 3L8 4.5 11.5 8 8 11.5 9.5 13 14 8 9.5 3zm-5 0L0 8l4.5 5L6 11.5 2.5 8 6 4.5 4.5 3z"/></svg>
      <span itemprop="name">Code</span>
      <meta itemprop="position" content="1">
</a>  </span>

    <span itemscope itemtype="http://schema.org/ListItem" itemprop="itemListElement">
      <a itemprop="url" data-hotkey="g i" class="js-selected-navigation-item reponav-item" data-selected-links="repo_issues repo_labels repo_milestones /lilianweng/lil-log/issues" href="/lilianweng/lil-log/issues">
        <svg class="octicon octicon-issue-opened" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"/></svg>
        <span itemprop="name">Issues</span>
        <span class="Counter">0</span>
        <meta itemprop="position" content="2">
</a>    </span>

  <span itemscope itemtype="http://schema.org/ListItem" itemprop="itemListElement">
    <a data-hotkey="g p" itemprop="url" class="js-selected-navigation-item reponav-item" data-selected-links="repo_pulls checks /lilianweng/lil-log/pulls" href="/lilianweng/lil-log/pulls">
      <svg class="octicon octicon-git-pull-request" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"/></svg>
      <span itemprop="name">Pull requests</span>
      <span class="Counter">0</span>
      <meta itemprop="position" content="3">
</a>  </span>

    <a data-hotkey="g b" class="js-selected-navigation-item reponav-item" data-selected-links="repo_projects new_repo_project repo_project /lilianweng/lil-log/projects" href="/lilianweng/lil-log/projects">
      <svg class="octicon octicon-project" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"/></svg>
      Projects
      <span class="Counter" >0</span>
</a>


  <a class="js-selected-navigation-item reponav-item" data-selected-links="repo_graphs repo_contributors dependency_graph pulse /lilianweng/lil-log/pulse" href="/lilianweng/lil-log/pulse">
    <svg class="octicon octicon-graph" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z"/></svg>
    Insights
</a>

</nav>


  </div>

<div class="container new-discussion-timeline experiment-repo-nav  ">
  <div class="repository-content ">

    
  <a class="d-none js-permalink-shortcut" data-hotkey="y" href="/lilianweng/lil-log/blob/7f5b5ab60bac17778a305ab8bfef33bb90705a02/_posts/2018-04-08-policy-gradient-algorithms.md">Permalink</a>

  <!-- blob contrib key: blob_contributors:v21:0b0aabe99d51d35d75f31f4818bc2115 -->

      <div class="signup-prompt-bg rounded-1">
      <div class="signup-prompt p-4 text-center mb-4 rounded-1">
        <div class="position-relative">
          <!-- '"` --><!-- </textarea></xmp> --></option></form><form action="/site/dismiss_signup_prompt" accept-charset="UTF-8" method="post"><input name="utf8" type="hidden" value="&#x2713;" /><input type="hidden" name="authenticity_token" value="Y8enuuarTnsv9TR6pa7v3RXEbjj7JG4N+7TIgyLvBuIMqGGyjy85+EAqztXUzI0VNj3fjV3ZRextOiFWwh8paQ==" />
            <button type="submit" class="position-absolute top-0 right-0 btn-link link-gray" data-ga-click="(Logged out) Sign up prompt, clicked Dismiss, text:dismiss">
              Dismiss
            </button>
</form>          <h3 class="pt-2">Join GitHub today</h3>
          <p class="col-6 mx-auto">GitHub is home to over 28 million developers working together to host and review code, manage projects, and build software together.</p>
          <a class="btn btn-primary" href="/join?source=prompt-blob-show" data-ga-click="(Logged out) Sign up prompt, clicked Sign up, text:sign-up">Sign up</a>
        </div>
      </div>
    </div>


  <div class="file-navigation">
    
<div class="select-menu branch-select-menu js-menu-container js-select-menu float-left">
  <button class=" btn btn-sm select-menu-button js-menu-target css-truncate" data-hotkey="w"
    
    type="button" aria-label="Switch branches or tags" aria-expanded="false" aria-haspopup="true">
      <i>Branch:</i>
      <span class="js-select-button css-truncate-target">master</span>
  </button>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax>

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <svg class="octicon octicon-x js-menu-close" role="img" aria-label="Close" viewBox="0 0 12 16" version="1.1" width="12" height="16"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/></svg>
        <span class="select-menu-title">Switch branches/tags</span>
      </div>

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="form-control js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" data-filter-placeholder="Filter branches/tags" class="js-select-menu-tab" role="tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" data-filter-placeholder="Find a tag…" class="js-select-menu-tab" role="tab">Tags</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches" role="menu">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/lilianweng/lil-log/blob/gh-pages/_posts/2018-04-08-policy-gradient-algorithms.md"
               data-name="gh-pages"
               data-skip-pjax="true"
               rel="nofollow">
              <svg class="octicon octicon-check select-menu-item-icon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                gh-pages
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open selected"
               href="/lilianweng/lil-log/blob/master/_posts/2018-04-08-policy-gradient-algorithms.md"
               data-name="master"
               data-skip-pjax="true"
               rel="nofollow">
              <svg class="octicon octicon-check select-menu-item-icon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                master
              </span>
            </a>
        </div>

          <div class="select-menu-no-results">Nothing to show</div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div>

    </div>
  </div>
</div>

    <div class="BtnGroup float-right">
      <a href="/lilianweng/lil-log/find/master"
            class="js-pjax-capture-input btn btn-sm BtnGroup-item"
            data-pjax
            data-hotkey="t">
        Find file
      </a>
      <clipboard-copy for="blob-path" class="btn btn-sm BtnGroup-item">
        Copy path
      </clipboard-copy>
    </div>
    <div id="blob-path" class="breadcrumb">
      <span class="repo-root js-repo-root"><span class="js-path-segment"><a data-pjax="true" href="/lilianweng/lil-log"><span>lil-log</span></a></span></span><span class="separator">/</span><span class="js-path-segment"><a data-pjax="true" href="/lilianweng/lil-log/tree/master/_posts"><span>_posts</span></a></span><span class="separator">/</span><strong class="final-path">2018-04-08-policy-gradient-algorithms.md</strong>
    </div>
  </div>


  
  <div class="commit-tease">
      <span class="float-right">
        <a class="commit-tease-sha" href="/lilianweng/lil-log/commit/159e1d0b29d83d18af965c93290e1cf2a2504132" data-pjax>
          159e1d0
        </a>
        <relative-time datetime="2018-08-22T01:58:22Z">Aug 21, 2018</relative-time>
      </span>
      <div>
        <a rel="author" data-skip-pjax="true" data-hovercard-user-id="901179" data-octo-click="hovercard-link-click" data-octo-dimensions="link_type:self" href="/lilianweng"><img class="avatar" src="https://avatars3.githubusercontent.com/u/901179?s=40&amp;v=4" width="20" height="20" alt="@lilianweng" /></a>
        <a class="user-mention" rel="author" data-hovercard-user-id="901179" data-octo-click="hovercard-link-click" data-octo-dimensions="link_type:self" href="/lilianweng">lilianweng</a>
          <a data-pjax="true" title="more on twitter card" class="message" href="/lilianweng/lil-log/commit/159e1d0b29d83d18af965c93290e1cf2a2504132">more on twitter card</a>
      </div>

    <div class="commit-tease-contributors">
      
<details class="details-reset details-overlay details-overlay-dark lh-default text-gray-dark float-left mr-2" id="blob_contributors_box">
  <summary class="btn-link" aria-haspopup="dialog"  >
    
    <span><strong>1</strong> contributor</span>
  </summary>
  <details-dialog class="Box Box--overlay d-flex flex-column anim-fade-in fast " aria-label="Users who have contributed to this file">
    <div class="Box-header">
      <button class="Box-btn-octicon btn-octicon float-right" type="button" aria-label="Close dialog" data-close-dialog>
        <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/></svg>
      </button>
      <h3 class="Box-title">Users who have contributed to this file</h3>
    </div>
    
        <ul class="list-style-none overflow-auto">
            <li class="Box-row">
              <a class="link-gray-dark no-underline" href="/lilianweng">
                <img class="avatar mr-2" alt="" src="https://avatars3.githubusercontent.com/u/901179?s=40&amp;v=4" width="20" height="20" />
                lilianweng
</a>            </li>
        </ul>

  </details-dialog>
</details>
      
    </div>
  </div>



  <div class="file">
    <div class="file-header">
  <div class="file-actions">

    <div class="BtnGroup">
      <a id="raw-url" class="btn btn-sm BtnGroup-item" href="/lilianweng/lil-log/raw/master/_posts/2018-04-08-policy-gradient-algorithms.md">Raw</a>
        <a class="btn btn-sm js-update-url-with-hash BtnGroup-item" data-hotkey="b" href="/lilianweng/lil-log/blame/master/_posts/2018-04-08-policy-gradient-algorithms.md">Blame</a>
      <a rel="nofollow" class="btn btn-sm BtnGroup-item" href="/lilianweng/lil-log/commits/master/_posts/2018-04-08-policy-gradient-algorithms.md">History</a>
    </div>


        <button type="button" class="btn-octicon disabled tooltipped tooltipped-nw"
          aria-label="You must be signed in to make or propose changes">
          <svg class="octicon octicon-pencil" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 0 1 1.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"/></svg>
        </button>
        <button type="button" class="btn-octicon btn-octicon-danger disabled tooltipped tooltipped-nw"
          aria-label="You must be signed in to make or propose changes">
          <svg class="octicon octicon-trashcan" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"/></svg>
        </button>
  </div>

  <div class="file-info">
      797 lines (507 sloc)
      <span class="file-info-divider"></span>
    58.5 KB
  </div>
</div>

    
  <div id="readme" class="readme blob instapaper_body">
    <article class="markdown-body entry-content" itemprop="text"><table data-table-type="yaml-metadata">
  <thead>
  <tr>
  <th>layout</th>
  <th>comments</th>
  <th>title</th>
  <th>date</th>
  <th>tags</th>
  <th>image</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td><div>post</div></td>
  <td><div>false</div></td>
  <td><div>Policy Gradient Algorithms</div></td>
  <td><div>2018-04-07 17:15:06 -0700</div></td>
  <td><div>reinforcement-learning review</div></td>
  <td><div>A3C_vs_A2C.png</div></td>
  </tr>
  </tbody>
</table>

<blockquote>
<p>Abstract: In this post, we are going to look deep into policy gradient, why it works, and many new policy gradient algorithms proposed in recent years: vanilla policy gradient, actor-critic, off-policy actor-critic, A3C, A2C, DPG, DDPG, D4PG, MADDPG, TRPO, PPO, ACER, ACTKR, and Soft AC.</p>
</blockquote>

<p>[Updated on 2018-06-30: Two new policy gradient methods, <a href="#soft-actor-critic">Soft AC</a> and <a href="#d4pg">D4PG</a>.]</p>
<p>{: class="table-of-content"}</p>
<ul>
<li>TOC
{:toc}</li>
</ul>
<h2><a id="user-content-what-is-policy-gradient" class="anchor" aria-hidden="true" href="#what-is-policy-gradient"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>What is Policy Gradient</h2>
<p>Policy gradient is an approach to solve reinforcement learning problems. If you haven’t looked into the field of reinforcement learning, please first read the section ["A (Long) Peek into Reinforcement Learning &gt;&gt; Key Concepts"]({{ site.baseurl }}{% post_url 2018-02-19-a-long-peek-into-reinforcement-learning %}#key-concepts) for the problem definition and key concepts.</p>
<h3><a id="user-content-notations" class="anchor" aria-hidden="true" href="#notations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Notations</h3>
<p>Here is a list of notations to help you read through equations in the post easily.</p>
<p>{: class="info"}
| Symbol | Meaning |
| ----------------------------- | ------------- |
| $$s \in \mathcal{S}$$ | States. |
| $$a \in \mathcal{A}$$ | Actions. |
| $$r \in \mathcal{R}$$ | Rewards. |
| $$S_t, A_t, R_t$$ | State, action and reward at time step t of one trajectory. I may occasionally use $$s_t, a_t, r_t$$ as well. |
| $$\gamma$$ | Discount factor; penalty to uncertainty of future rewards; $$0&lt;\gamma \leq 1$$. |
| $$G_t$$ | Return; or discounted future reward; $$G_t = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}$$. |
| $$P(s’, r \vert s, a)$$ | Transition probability of getting to the next state s’ from the current state s with action a and reward r. |
| $$\pi(a \vert s)$$ | Stochastic policy (agent behavior strategy); $$\pi_\theta(.)$$ is a policy parameterized by θ. |
| $$\mu(a)$$ | Deterministic policy; we can also label this as $$\pi(s)$$, but using a different letter gives better distinction so that we can easily tell when the policy is stochastic or deterministic without further explanation. Either $$\pi$$ or $$\mu$$ is what a reinforcement learning algorithm aims to learn. |
| $$V(s)$$ | State-value function measures the expected return of state s; $$V_w(.)$$ is a value function parameterized by w.|
| $$V^\pi(s)$$ | The value of state s when we follow a policy π; $$V^\pi (s) = \mathbb{E}<em>{a\sim \pi} [G_t \vert S_t = s]$$. |
| $$Q(s, a)$$ | Action-value function is similar to $$V(s)$$, but it assesses the expected return of a pair of state and action (s, a); $$Q_w(.)$$ is a action value function parameterized by w. |
| $$Q^\pi(s, a)$$ | Similar to $$V</em>\pi(.)$$, the value of (state, action) pair when we follow a policy π; $$Q^\pi(s, a) = \mathbb{E}_{a\sim \pi} [G_t \vert S_t = s, A_t = a]$$. |
| $$A(s, a)$$ | Advantage function, $$A(s, a) = Q(s, a) - V(s)$$; it can be considered as another version of Q-value with lower variance by taking the state-value off as the baseline. |</p>
<h3><a id="user-content-policy-gradient" class="anchor" aria-hidden="true" href="#policy-gradient"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Policy Gradient</h3>
<p>The goal of reinforcement learning is to find an optimal behavior strategy for the agent to obtain optimal rewards. The <strong>policy gradient</strong> methods target at modeling and optimizing the policy directly. The policy is usually modeled with a parameterized function respect to θ, $$\pi_\theta(a \vert s)$$. The value of the reward (objective) function depends on this policy and then various algorithms can be applied to optimize θ for the best reward.</p>
<p>The reward function is defined as:</p>
<p>$$
J(\theta)
= \sum_{s \in \mathcal{S}} d^\pi(s) V^\pi(s)
= \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} \pi_\theta(a \vert s) Q^\pi(s, a)
$$</p>
<p>where $$d^\pi(s)$$ is the stationary distribution of Markov chain for $$\pi_\theta$$ (on-policy state distribution under π).
For simplicity, the θ parameter would be omitted for the policy $$\pi_\theta$$ when the policy is present in the subscript of other functions; for example, $$d^{\pi}$$ and $$Q^\pi$$ should be $$d^{\pi_\theta}$$ and $$Q^{\pi_\theta}$$ if written in full.
Imagine that you can travel along the Markov chain’s states forever, and eventually, as the time progresses, the probability of you ending up with one state becomes unchanged --- this is the stationary probability for $$\pi_\theta$$. $$d^\pi(s) = \lim_{t \to \infty} P(s_t = s \vert s_0, \pi_\theta)$$ is the probability that $$s_t=s$$ when starting from $$s_0$$ and following policy $$\pi_\theta$$ for t steps. Actually, the existence of the stationary distribution of Markov chain is one main reason for why PageRank algorithm works. If you want to read more, check <a href="https://jeremykun.com/2015/04/06/markov-chain-monte-carlo-without-all-the-bullshit/" rel="nofollow">this</a>.</p>
<p>It is natural to expect policy-based methods are more useful in the continuous space. Because there is an infinite number of actions and (or) states to estimate the values for and hence value-based approaches are way too expensive computationally in the continuous space. For example, in [generalized policy iteration]({{ site.baseurl }}{% post_url 2018-02-19-a-long-peek-into-reinforcement-learning %}#policy-iteration), the policy improvement step $$\arg\max_{a \in \mathcal{A}} Q^\pi(s, a)$$ requires a full scan of the action space, suffering from the <a href="https://en.wikipedia.org/wiki/Curse_of_dimensionality" rel="nofollow">curse of dimensionality</a>.</p>
<p>Using <em>gradient ascent</em>, we can move θ toward the direction suggested by the gradient $$\nabla_\theta J(\theta)$$ to find the best θ for $$\pi_\theta$$ that produces the highest return.</p>
<h3><a id="user-content-policy-gradient-theorem" class="anchor" aria-hidden="true" href="#policy-gradient-theorem"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Policy Gradient Theorem</h3>
<p>Computing the gradient $$\nabla_\theta J(\theta)$$ is tricky because it depends on both the action selection (directly determined by $$\pi_\theta$$) and the stationary distribution of states following the target selection behavior (indirectly determined by $$\pi_\theta$$). Given that the environment is generally unknown, it is difficult to estimate the effect on the state distribution by a policy update.</p>
<p>Luckily, the <strong>policy gradient theorem</strong> comes to save the world! Woohoo! It provides a nice reformation of the derivative of the objective function to not involve the derivative of the state distribution $$d^\pi(.)$$ and simplify the gradient computation $$\nabla_\theta J(\theta)$$ a lot.</p>
<p>$$
\begin{aligned}
\nabla_\theta J(\theta)
&amp;= \nabla_\theta \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} Q^\pi(s, a) \pi_\theta(a \vert s) \
&amp;\propto \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} Q^\pi(s, a) \nabla_\theta \pi_\theta(a \vert s)
\end{aligned}
$$</p>
<h3><a id="user-content-proof-of-policy-gradient-theorem" class="anchor" aria-hidden="true" href="#proof-of-policy-gradient-theorem"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Proof of Policy Gradient Theorem</h3>
<p>This session is pretty dense, as it is the time for us to go through the proof (<a href="http://incompleteideas.net/book/bookdraft2017nov5.pdf" rel="nofollow">Sutton &amp; Barto, 2017</a>; Sec. 13.1) and figure out why the policy gradient theorem is correct.</p>
<p>We first start with the derivative of the state value function:</p>
<p>$$
\begin{aligned}
&amp; \nabla_\theta V^\pi(s) \
=&amp; \nabla_\theta \Big(\sum_{a \in \mathcal{A}} \pi_\theta(a \vert s)Q^\pi(s, a) \Big) &amp; \
=&amp; \sum_{a \in \mathcal{A}} \Big( \nabla_\theta \pi_\theta(a \vert s)Q^\pi(s, a) + \pi_\theta(a \vert s) \color{red}{\nabla_\theta Q^\pi(s, a)} \Big) &amp; \scriptstyle{\text{; Derivative product rule.}} \
=&amp; \sum_{a \in \mathcal{A}} \Big( \nabla_\theta \pi_\theta(a \vert s)Q^\pi(s, a) + \pi_\theta(a \vert s) \color{red}{\nabla_\theta \sum_{s', r} P(s',r \vert s,a)(r + V^\pi(s'))} \Big) &amp; \scriptstyle{\text{; Extend } Q^\pi \text{ with future state value.}} \
=&amp; \sum_{a \in \mathcal{A}} \Big( \nabla_\theta \pi_\theta(a \vert s)Q^\pi(s, a) + \pi_\theta(a \vert s) \color{red}{\sum_{s', r} P(s',r \vert s,a) \nabla_\theta V^\pi(s')} \Big) &amp; \scriptstyle{P(s',r \vert s,a) \text{ or } r \text{ is not a func of }\theta}\
=&amp; \sum_{a \in \mathcal{A}} \Big( \nabla_\theta \pi_\theta(a \vert s)Q^\pi(s, a) + \pi_\theta(a \vert s) \color{red}{\sum_{s'} P(s' \vert s,a) \nabla_\theta V^\pi(s')} \Big) &amp; \scriptstyle{\text{; Because }  P(s' \vert s, a) = \sum_r P(s', r \vert s, a)}
\end{aligned}
$$</p>
<p>Now we have:</p>
<p>$$
\color{red}{\nabla_\theta V^\pi(s)}
= \sum_{a \in \mathcal{A}} \Big( \nabla_\theta \pi_\theta(a \vert s)Q^\pi(s, a) + \pi_\theta(a \vert s) \sum_{s'} P(s' \vert s,a) \color{red}{\nabla_\theta V^\pi(s')} \Big)
$$</p>
<p>This equation has a nice recursive form (see the red parts!) and the future state value function $$V^\pi(s')$$ can be repeated unrolled by following the same equation.</p>
<p>Let’s consider the following visitation sequence and label the probability of transitioning from state s to state x with policy $$\pi_\theta$$ after k step as $$\rho^\pi(s \to x, k)$$.</p>
<p>$$
s \xrightarrow[]{a \sim \pi_\theta(.\vert s)} s' \xrightarrow[]{a \sim \pi_\theta(.\vert s')} s'' \xrightarrow[]{a \sim \pi_\theta(.\vert s'')} \dots
$$</p>
<ul>
<li>When k = 0: $$\rho^\pi(s \to s, k=0) = 1$$.</li>
<li>When k = 1, we scan through all possible actions and sum up the transition probabilities to the target state: $$\rho^\pi(s \to s’, k=1) = \sum_a \pi_\theta(a \vert s) P(s’ \vert s, a)$$.</li>
<li>Imagine that the goal is to go from state s to x after k+1 steps while following policy $$\pi_\theta$$. We can first travel from s to a middle point s’ (any state can be a middle point, $$s’ \in \mathcal{S}$$) after k steps and then go to the final state x during the last step. In this way, we are able to update the visitation probability recursively: $$\rho^\pi(s \to x, k+1) = \sum_{s'} \rho^\pi(s \to s', k) \rho^\pi(s' \to x, 1)$$.</li>
</ul>
<p>Then we go back to unroll the recursive representation of $$\nabla_\theta V^\pi(s)$$! Let $$\phi(s) = \sum_{a \in \mathcal{A}} \nabla_\theta \pi_\theta(a \vert s)Q^\pi(s, a)$$ to simplify the maths. If we keep on extending $$\nabla_\theta V^\pi(.)$$ infinitely, it is easy to find out that we can transition from the starting state s to any state after any number of steps in this unrolling process and by summing up all the visitation probabilities, we get $$\nabla_\theta V^\pi(s)$$!</p>
<p>$$
\begin{aligned}
&amp; \color{red}{\nabla_\theta V^\pi(s)} \
=&amp; \phi(s) + \sum_a \pi_\theta(a \vert s) \sum_{s'} P(s' \vert s,a) \color{red}{\nabla_\theta V^\pi(s')} \
=&amp; \phi(s) + \sum_{s'} \sum_a \pi_\theta(a \vert s) P(s' \vert s,a) \color{red}{\nabla_\theta V^\pi(s')} \
=&amp; \phi(s) + \sum_{s'} \rho^\pi(s \to s', 1) \color{red}{\nabla_\theta V^\pi(s')} \
=&amp; \phi(s) + \sum_{s'} \rho^\pi(s \to s', 1) \color{red}{\nabla_\theta V^\pi(s')} \
=&amp; \phi(s) + \sum_{s'} \rho^\pi(s \to s', 1) \color{red}{[ \phi(s') + \sum_{s''} \rho^\pi(s' \to s'', 1) \nabla_\theta V^\pi(s'')]} \
=&amp; \phi(s) + \sum_{s'} \rho^\pi(s \to s', 1) \phi(s') + \sum_{s''} \rho^\pi(s \to s'', 2)\color{red}{\nabla_\theta V^\pi(s'')} \scriptstyle{\text{ ; Consider }s'\text{ as the middle point for }s \to s''}\
=&amp; \phi(s) + \sum_{s'} \rho^\pi(s \to s', 1) \phi(s') + \sum_{s''} \rho^\pi(s \to s'', 2)\phi(s'') + \sum_{s'''} \rho^\pi(s \to s''', 3)\color{red}{\nabla_\theta V^\pi(s''')} \
=&amp; \dots \scriptstyle{\text{; Repeatedly unrolling the part of }\nabla_\theta V^\pi(.)} \
=&amp; \sum_{x\in\mathcal{S}}\sum_{k=0}^\infty \rho^\pi(s \to x, k) \phi(x)
\end{aligned}
$$</p>
<p>The nice rewriting above allows us to exclude the derivative of Q-value function, $$\nabla_\theta Q^\pi(s, a)$$. By plugging it into the objective function $$J(\theta)$$, we are getting the following:</p>
<p>$$
\begin{aligned}
\nabla_\theta J(\theta)
&amp;= \nabla_\theta V^\pi(s_0) &amp; \scriptstyle{\text{; Starting from a random state } s_0} \
&amp;= \sum_{s}\color{blue}{\sum_{k=0}^\infty \rho^\pi(s_0 \to s, k)} \phi(s) &amp;\scriptstyle{\text{; Let }\color{blue}{\eta(s) = \sum_{k=0}^\infty \rho^\pi(s_0 \to s, k)}} \
&amp;= \sum_{s}\eta(s) \phi(s) &amp; \
&amp;= \Big( {\sum_s \eta(s)} \Big)\sum_{s}\frac{\eta(s)}{\sum_s \eta(s)} \phi(s) &amp; \scriptstyle{\text{; Normalize } \eta(s), s\in\mathcal{S} \text{ to be a probability distribution.}}\
&amp;\propto \sum_s \frac{\eta(s)}{\sum_s \eta(s)} \phi(s) &amp; \scriptstyle{\sum_s \eta(s)\text{  is a constant}} \
&amp;= \sum_s d^\pi(s) \sum_a \nabla_\theta \pi_\theta(a \vert s)Q^\pi(s, a) &amp; \scriptstyle{d^\pi(s) = \frac{\eta(s)}{\sum_s \eta(s)}\text{ is stationary distribution.}}
\end{aligned}
$$</p>
<p>In the episodic case, the constant of proportionality ($$\sum_s \eta(s)$$) is the average length of an episode; in the continuing case, it is 1 (<a href="http://incompleteideas.net/book/bookdraft2017nov5.pdf" rel="nofollow">Sutton &amp; Barto, 2017</a>; Sec. 13.1). The gradient can be further written as:</p>
<p>$$
\begin{aligned}
\nabla_\theta J(\theta)
&amp;\propto \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} Q^\pi(s, a) \nabla_\theta \pi_\theta(a \vert s)  &amp;\
&amp;= \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} \pi_\theta(a \vert s) Q^\pi(s, a) \frac{\nabla_\theta \pi_\theta(a \vert s)}{\pi_\theta(a \vert s)} &amp;\
&amp;= \mathbb{E}<em>\pi [Q^\pi(s, a) \nabla</em>\theta \ln \pi_\theta(a \vert s)] &amp; \scriptstyle{\text{; Because } (\ln x)' = 1/x}
\end{aligned}
$$</p>
<p>Where $$\mathbb{E}<em>\pi$$ refers to $$\mathbb{E}</em>{s \sim d_\pi, a \sim \pi_\theta}$$ when both state and action distributions follow the policy $$\pi_\theta$$ (on policy).</p>
<p>The policy gradient theorem lays the theoretical foundation for various policy gradient algorithms. This vanilla policy gradient update has no bias but high variance. Many following algorithms were proposed to reduce the variance while keeping the bias unchanged.</p>
<p>$$
\nabla_\theta J(\theta)  = \mathbb{E}<em>\pi [Q^\pi(s, a) \nabla</em>\theta \ln \pi_\theta(a \vert s)]
$$</p>
<p>Here is a nice summary of a general form of policy gradient methods borrowed from the <a href="https://arxiv.org/pdf/1506.02438.pdf" rel="nofollow">GAE</a> (general advantage estimation) paper (<a href="https://arxiv.org/abs/1506.02438" rel="nofollow">Schulman et al., 2016</a>) and this <a href="https://danieltakeshi.github.io/2017/04/02/notes-on-the-generalized-advantage-estimation-paper/" rel="nofollow">post</a> thoroughly discussed several components in GAE , highly recommended.</p>
<p>![General form]({{ '/assets/images/general_form_policy_gradient.png' | relative_url }})
{: class="center"}
<em>Fig. 1. A general form of policy gradient methods. (Image source: <a href="https://arxiv.org/abs/1506.02438" rel="nofollow">Schulman et al., 2016</a>)</em></p>
<h2><a id="user-content-policy-gradient-algorithms" class="anchor" aria-hidden="true" href="#policy-gradient-algorithms"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Policy Gradient Algorithms</h2>
<p>Tons of policy gradient algorithms have been proposed during recent years and there is no way for me to exhaust them. I'm introducing some of them that I happened to know and read about.</p>
<h3><a id="user-content-reinforce" class="anchor" aria-hidden="true" href="#reinforce"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>REINFORCE</h3>
<p><strong>REINFORCE</strong> (Monte-Carlo policy gradient) relies on an estimated return by [Monte-Carlo]({{ site.baseurl }}{% post_url 2018-02-19-a-long-peek-into-reinforcement-learning %}#monte-carlo-methods) methods using episode samples to update the policy parameter $$\theta$$. REINFORCE works because the expectation of the sample gradient is equal to the actual gradient:</p>
<p>$$
\begin{aligned}
\nabla_\theta J(\theta)
&amp;= \mathbb{E}<em>\pi [Q^\pi(s, a) \nabla</em>\theta \ln \pi_\theta(a \vert s)] &amp; \
&amp;= \mathbb{E}<em>\pi [G_t \nabla</em>\theta \ln \pi_\theta(A_t \vert S_t)] &amp; \scriptstyle{\text{; Because } Q^\pi(S_t, A_t) = \mathbb{E}_\pi[G_t \vert S_t, A_t]}
\end{aligned}
$$</p>
<p>Therefore we are able to measure $$G_t$$ from real sample trajectories and use that to update our policy gradient. It relies on a full trajectory and that’s why it is a Monte-Carlo method.</p>
<p>The process is pretty straightforward:</p>
<ol>
<li>Initialize the policy parameter θ at random.</li>
<li>Generate one trajectory on policy $$\pi_\theta$$: $$S_1, A_1, R_2, S_2, A_2, \dots, S_T$$.</li>
<li>For t=1, 2, ... , T:
<ol>
<li>Estimate the the return $$G_t$$;</li>
<li>Update policy parameters: $$\theta \leftarrow \theta + \alpha \gamma^t G_t \nabla_\theta \ln \pi_\theta(A_t \vert S_t)$$</li>
</ol>
</li>
</ol>
<p>A widely used variation of REINFORCE is to subtract a baseline value from the return $$G_t$$ to <em>reduce the variance of gradient estimation while keeping the bias unchanged</em> (Remember we always want to do this when possible). For example, a common baseline is to subtract state-value from action-value, and if applied, we would use advantage $$A(s, a) = Q(s, a) - V(s)$$ in the gradient ascent update. This <a href="https://danieltakeshi.github.io/2017/03/28/going-deeper-into-reinforcement-learning-fundamentals-of-policy-gradients/" rel="nofollow">post</a> nicely explained why a baseline works for reducing the variance, in addition to a set of fundamentals of policy gradient.</p>
<h3><a id="user-content-actor-critic" class="anchor" aria-hidden="true" href="#actor-critic"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Actor-Critic</h3>
<p>Two main components in policy gradient are the policy model and the value function. It makes a lot of sense to learn the value function in addition to the policy, since knowing the value function can assist the policy update, such as by reducing gradient variance in vanilla policy gradients, and that is exactly what the <strong>Actor-Critic</strong> method does.</p>
<p>Actor-critic methods consist of two models, which may optionally share parameters:</p>
<ul>
<li><strong>Critic</strong> updates the value function parameters w and depending on the algorithm it could be action-value $$Q_w(a \vert s)$$ or state-value $$V_w(s)$$.</li>
<li><strong>Actor</strong> updates the policy parameters θ for $$\pi_\theta(a \vert s)$$, in the direction suggested by the critic.</li>
</ul>
<p>Let’s see how it works in a simple action-value actor-critic algorithm.</p>
<ol>
<li>Initialize s, θ, w at random; sample $$a \sim \pi_\theta(a \vert s)$$.</li>
<li>For $$t = 1 \dots T$$:
<ol>
<li>Sample reward $$r_t \sim R(s, a)$$ and next state $$s’ \sim P(s’ \vert s, a)$$;</li>
<li>Then sample the next action $$a’ \sim \pi_\theta(a’ \vert s’)$$;</li>
<li>Update the policy parameters: $$\theta \leftarrow \theta + \alpha_\theta Q_w(s, a) \nabla_\theta \ln \pi_\theta(a \vert s)$$;</li>
<li>Compute the correction (TD error) for action-value at time t: <br>$$\delta_t = r_t + \gamma Q_w(s’, a’) - Q_w(s, a)$$ <br>and use it to update the parameters of action-value function:<br> $$w \leftarrow w + \alpha_w \delta_t \nabla_w Q_w(s, a)$$</li>
<li>Update $$a \leftarrow a’$$ and $$s \leftarrow s’$$.</li>
</ol>
</li>
</ol>
<p>Two learning rates, $$\alpha_\theta$$ and $$\alpha_w$$, are predefined for policy and value function parameter updates respectively.</p>
<h3><a id="user-content-off-policy-policy-gradient" class="anchor" aria-hidden="true" href="#off-policy-policy-gradient"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Off-Policy Policy Gradient</h3>
<p>Both REINFORCE and the vanilla version of actor-critic method are on-policy: training samples are collected according to the target policy --- the very same policy that we try to optimize for. Off policy methods, however, result in several additional advantages:</p>
<ol>
<li>The off-policy approach does not require full trajectories and can reuse any past episodes ([“experience replay”]({{ site.baseurl }}{% post_url 2018-02-19-a-long-peek-into-reinforcement-learning %}#deep-q-network)) for much better sample efficiency.</li>
<li>The sample collection follows a behavior policy different from the target policy, bringing better [exploration]({{ site.baseurl }}{% post_url 2018-02-19-a-long-peek-into-reinforcement-learning %}#exploration-exploitation-dilemma).</li>
</ol>
<p>Now let’s see how off-policy policy gradient is computed. The behavior policy for collecting samples is a known policy (predefined just like a hyperparameter), labelled as $$\beta(a \vert s)$$. The objective function sums up the reward over the state distribution defined by this behavior policy:</p>
<p>$$
J(\theta)
= \sum_{s \in \mathcal{S}} d^\beta(s) \sum_{a \in \mathcal{A}} Q^\pi(s, a) \pi_\theta(a \vert s)
= \mathbb{E}<em>{s \sim d^\beta} \big[ \sum</em>{a \in \mathcal{A}} Q^\pi(s, a) \pi_\theta(a \vert s) \big]
$$</p>
<p>where $$d^\beta(s)$$ is the stationary distribution of the behavior policy β; recall that $$d^\beta(s) = \lim_{t \to \infty} P(S_t = s \vert S_0, \beta)$$; and $$Q^\pi$$ is the action-value function estimated with regard to the target policy π (not the behavior policy!).</p>
<p>Given that the training observations are sampled by $$a \sim \beta(a \vert s)$$, we can rewrite the gradient as:</p>
<p>$$
\begin{aligned}
\nabla_\theta J(\theta)
&amp;= \nabla_\theta \mathbb{E}<em>{s \sim d^\beta} \Big[ \sum</em>{a \in \mathcal{A}} Q^\pi(s, a) \pi_\theta(a \vert s)  \Big] &amp; \
&amp;= \mathbb{E}<em>{s \sim d^\beta} \Big[ \sum</em>{a \in \mathcal{A}} \big( Q^\pi(s, a) \nabla_\theta \pi_\theta(a \vert s) + \color{red}{\pi_\theta(a \vert s) \nabla_\theta Q^\pi(s, a)} \big) \Big] &amp; \scriptstyle{\text{; Derivative product rule.}}\
&amp;\stackrel{(i)}{\approx} \mathbb{E}<em>{s \sim d^\beta} \Big[ \sum</em>{a \in \mathcal{A}} Q^\pi(s, a) \nabla_\theta \pi_\theta(a \vert s) \Big] &amp; \scriptstyle{\text{; Ignore the red part: } \color{red}{\pi_\theta(a \vert s) \nabla_\theta Q^\pi(s, a)}}. \
&amp;= \mathbb{E}<em>{s \sim d^\beta} \Big[ \sum</em>{a \in \mathcal{A}} \beta(a \vert s) \frac{\pi_\theta(a \vert s)}{\beta(a \vert s)} Q^\pi(s, a) \frac{\nabla_\theta \pi_\theta(a \vert s)}{\pi_\theta(a \vert s)} \Big] &amp; \
&amp;= \mathbb{E}<em>\beta \Big[\frac{\color{blue}{\pi</em>\theta(a \vert s)}}{\color{blue}{\beta(a \vert s)}} Q^\pi(s, a) \nabla_\theta \ln \pi_\theta(a \vert s) \Big] &amp; \scriptstyle{\text{; The blue part is the importance weight.}}
\end{aligned}
$$</p>
<p>where $$\frac{\pi_\theta(a \vert s)}{\beta(a \vert s)}$$ is the <a href="http://timvieira.github.io/blog/post/2014/12/21/importance-sampling/" rel="nofollow">importance weight</a>. Because $$Q^\pi$$ is a function of the target policy and thus a function of policy parameter θ,  we should take the derivative of $$\nabla_\theta Q^\pi(s, a)$$ as well according to the product rule. However, it is super hard to compute $$\nabla_\theta Q^\pi(s, a)$$ in reality. Fortunately if we use an approximated gradient with the gradient of Q ignored, we still guarantee the policy improvement and eventually achieve the true local minimum. This is justified in the proof <a href="https://arxiv.org/pdf/1205.4839.pdf" rel="nofollow">here</a> (Degris, White &amp; Sutton, 2012).</p>
<p>In summary, when applying policy gradient in the off-policy setting, we can simple adjust it with a weighted sum and the weight is the ratio of the target policy to the behavior policy, $$\frac{\pi_\theta(a \vert s)}{\beta(a \vert s)}$$.</p>
<h3><a id="user-content-a3c" class="anchor" aria-hidden="true" href="#a3c"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>A3C</h3>
<p>[<a href="https://arxiv.org/abs/1602.01783" rel="nofollow">paper</a>|code]</p>
<p><strong>Asynchronous Advantage Actor-Critic</strong> (<a href="https://arxiv.org/abs/1602.01783" rel="nofollow">Mnih et al., 2016</a>), short for <strong>A3C</strong>, is a classic policy gradient method with a special focus on parallel training.</p>
<p>In A3C, the critics learn the value function while multiple actors are trained in parallel and get synced with global parameters from time to time. Hence, A3C is designed to work well for parallel training.</p>
<p>Let’s use the state-value function as an example. The loss function for state value is to minimize the mean squared error, $$J_v(w) = (G_t - V_w(s))^2$$ and gradient descent can be applied to find the optimal w. This state-value function is used as the baseline in the policy gradient update.</p>
<p>Here is the algorithm outline:</p>
<ol>
<li>We have global parameters, θ and w; similar thread-specific parameters, θ’ and w’.</li>
<li>Initialize the time step $$t = 1$$</li>
<li>While $$T &lt;= T_\text{MAX}$$:
<ol>
<li>Reset gradient: dθ = 0 and dw = 0.</li>
<li>Synchronize thread-specific parameters with global ones: θ’ = θ and w’ = w.</li>
<li>$$t_\text{start}$$ = t and sample a starting state $$s_t$$.</li>
<li>While ($$s_t$$ != TERMINAL) and $$t - t_\text{start} &lt;= t_\text{max}$$:
<ol>
<li>Pick the action $$A_t \sim \pi_{\theta’}(A_t \vert S_t)$$ and receive a new reward $$R_t$$ and a new state $$s_{t+1}$$.</li>
<li>Update t = t + 1 and T = T + 1</li>
</ol>
</li>
<li>Initialize the variable that holds the return estimation $$R = \begin{cases}
0 &amp; \text{if } s_t \text{ is TERMINAL} \
V_{w’}(s_t) &amp; \text{otherwise}
\end{cases}
$$</li>
<li>For $$i = t-1, \dots, t_\text{start}$$:
<ol>
<li>$$R \leftarrow \gamma R + R_i$$; here R is a MC measure of $$G_i$$.</li>
<li>Accumulate gradients w.r.t. θ’: $$d\theta \leftarrow d\theta + \nabla_{\theta’} \log \pi_{\theta’}(a_i \vert s_i)(R - V_{w'}(s_i))$$;<br>Accumulate gradients w.r.t. w’: $$dw \leftarrow dw + 2 (R - V_{w’}(s_i)) \nabla_{w’} (R - V_{w’}(s_i))$$.</li>
</ol>
</li>
<li>Update synchronously θ using dθ, and w using dw.</li>
</ol>
</li>
</ol>
<p>A3C enables the parallelism in multiple agent training. The gradient accumulation step (6.2) can be considered as a parallelized reformation of minibatch-based stochastic gradient update: the values of w or θ get corrected by a little bit in the direction of each training thread independently.</p>
<h3><a id="user-content-a2c" class="anchor" aria-hidden="true" href="#a2c"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>A2C</h3>
<p>[paper?|<a href="https://github.com/openai/baselines/blob/master/baselines/a2c/a2c.py">code</a>]</p>
<p><strong>A2C</strong> is a synchronous, deterministic version of A3C; that’s why it is named as “A2C” with the first “A” (“asynchronous”) removed. In A3C each agent talks to the global parameters independently, so it is possible sometimes the thread-specific agents would be playing with policies of different versions and therefore the aggregated update would not be optimal. To resolve the inconsistency, a coordinator in A2C waits for all the parallel actors to finish their work before updating the global parameters and then in the next iteration parallel actors starts from the same policy. The synchronized gradient update keeps the training more cohesive and potentially to make convergence faster.</p>
<p>A2C has been <a href="https://blog.openai.com/baselines-acktr-a2c/" rel="nofollow">shown</a> to be able to utilize GPUs more efficiently and work better with large batch sizes while achieving same or better performance than A3C.</p>
<p>![A2C]({{ '/assets/images/A3C_vs_A2C.png' | relative_url }})
{: class="center"}
<em>Fig. 2. The architecture of A3C versus A2C.</em></p>
<h3><a id="user-content-dpg" class="anchor" aria-hidden="true" href="#dpg"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>DPG</h3>
<p>[<a href="https://hal.inria.fr/file/index/docid/938992/filename/dpg-icml2014.pdf" rel="nofollow">paper</a>|code]</p>
<p>In methods described above, the policy function $$\pi(. \vert s)$$ is always modeled as a probability distribution over actions $$\mathcal{A}$$ given the current state and thus it is <em>stochastic</em>. <strong>Deterministic policy gradient (DPG)</strong> instead models the policy as a deterministic decision: $$a = \mu(s)$$. It may look bizarre --- how can you calculate the gradient of the policy function when it outputs a single action? Let’s look into it step by step.</p>
<p>Refresh on a few notations to facilitate the discussion:</p>
<ul>
<li>$$\rho_0(s)$$: The initial distribution over states</li>
<li>$$\rho^\mu(s \to s', k)$$: Starting from state s, the visitation probability density at state s’ after moving k steps by policy μ.</li>
<li>$$\rho^\mu(s')$$: Discounted state distribution, defined as $$\rho^\mu(s') = \int_\mathcal{S} \sum_{k=1}^\infty \gamma^{k-1} \rho_0(s) \rho^\mu(s \to s', k) ds$$.</li>
</ul>
<p>The objective function to optimize for is listed as follows:</p>
<p>$$
J(\theta) = \int_\mathcal{S} \rho^\mu(s) Q(s, \mu_\theta(s)) ds
$$</p>
<p><strong>Deterministic policy gradient theorem</strong>: Now it is the time to compute the gradient! According to the chain rule, we first take the gradient of Q w.r.t. the action a and then take the gradient of the deterministic policy function μ w.r.t. θ:</p>
<p>$$
\begin{aligned}
\nabla_\theta J(\theta)
&amp;= \int_\mathcal{S} \rho^\mu(s) \nabla_a Q^\mu(s, a) \nabla_\theta \mu_\theta(s) \rvert_{a=\mu_\theta(s)} ds \
&amp;= \mathbb{E}<em>{s \sim \rho^\mu} [\nabla_a Q^\mu(s, a) \nabla</em>\theta \mu_\theta(s) \rvert_{a=\mu_\theta(s)}]
\end{aligned}
$$</p>
<p>We can consider the deterministic policy as a <em>special case</em> of the stochastic one, when the probability distribution contains only one extreme non-zero value over one action. Actually, in the DPG <a href="https://hal.inria.fr/file/index/docid/938992/filename/dpg-icml2014.pdf" rel="nofollow">paper</a>, the authors have shown that if the stochastic policy $$\pi_{\mu_\theta, \sigma}$$ is re-parameterized by a deterministic policy $$\mu_\theta$$ and a variation variable $$\sigma$$, the stochastic policy is eventually equivalent to the deterministic case when $$\sigma=0$$. Compared to the deterministic policy, we expect the stochastic policy to require more samples as it integrates the data over the whole state and action space.</p>
<p>The deterministic policy gradient theorem can be plugged into common policy gradient frameworks.</p>
<p>Let’s consider an example of on-policy actor-critic algorithm to showcase the procedure. In each iteration of on-policy actor-critic, two actions are taken deterministically $$a = \mu_\theta(s)$$ and the [SARSA]({{ site.baseurl }}{% post_url 2018-02-19-a-long-peek-into-reinforcement-learning%}#sarsa-on-policy-td-control) update on policy parameters relies on the new gradient that we just computed above:</p>
<p>$$
\begin{aligned}
\delta_t &amp;= R_t + \gamma Q_w(s_{t+1}, a_{t+1}) - Q_w(s_t, a_t) &amp; \scriptstyle{\text{; TD error in SARSA}}\
w_{t+1} &amp;= w_t + \alpha_w \delta_t \nabla_w Q_w(s_t, a_t) &amp; \
\theta_{t+1} &amp;= \theta_t + \alpha_\theta \color{red}{\nabla_a Q_w(s_t, a_t) \nabla_\theta \mu_\theta(s) \rvert_{a=\mu_\theta(s)}} &amp; \scriptstyle{\text{; Deterministic policy gradient theorem}}
\end{aligned}
$$</p>
<p>However, unless there is sufficient noise in the environment, it is very hard to guarantee enough [exploration]({{ site.baseurl }}{% post_url 2018-02-19-a-long-peek-into-reinforcement-learning%}#exploration-exploitation-dilemma) due to the determinacy of the policy. We can either add noise into the policy (ironically this makes it nondeterministic!) or learn it off-policy-ly by following a different stochastic behavior policy to collect samples.</p>
<p>Say, in the off-policy approach, the training trajectories are generated by a stochastic policy $$\beta(a \vert s)$$ and thus the state distribution follows the corresponding discounted state density $$\rho^\beta$$:</p>
<p>$$
\begin{aligned}
J_\beta(\theta) &amp;= \int_\mathcal{S} \rho^\beta Q^\mu(s, \mu_\theta(s)) ds \
\nabla_\theta J_\beta(\theta) &amp;= \mathbb{E}<em>{s \sim \rho^\beta} [\nabla_a Q^\mu(s, a) \nabla</em>\theta \mu_\theta(s)  \rvert_{a=\mu_\theta(s)} ]
\end{aligned}
$$</p>
<p>Note that because the policy is deterministic, we only need $$Q^\mu(s, \mu_\theta(s))$$ rather than $$\sum_a \pi(a \vert s) Q^\pi(s, a)$$ as the estimated reward of a given state s.
In the off-policy approach with a stochastic policy, importance sampling is often used to correct the mismatch between behavior and target policies, as what we have described <a href="#off-policy-policy-gradient">above</a>. However, because the deterministic policy gradient removes the integral over actions, we can avoid importance sampling.</p>
<h3><a id="user-content-ddpg" class="anchor" aria-hidden="true" href="#ddpg"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>DDPG</h3>
<p>[<a href="https://arxiv.org/pdf/1509.02971.pdf" rel="nofollow">paper</a>|<a href="https://github.com/openai/baselines/tree/master/baselines/ddpg">code</a>]</p>
<p><strong>DDPG</strong> (<a href="https://arxiv.org/pdf/1509.02971.pdf" rel="nofollow">Lillicrap, et al., 2015</a>), short for <strong>Deep Deterministic Policy Gradient</strong>, is a model-free off-policy actor-critic algorithm, combining <a href="#dpg">DPG</a> with [DQN]({{ site.baseurl }}{% post_url 2018-02-19-a-long-peek-into-reinforcement-learning%}#deep-q-network). Recall that DQN (Deep Q-Network) stabilizes the learning of Q-function by experience replay and the frozen target network. The original DQN works in discrete space, and DDPG extends it to continuous space with the actor-critic framework while learning a deterministic policy.</p>
<p>In order to do better exploration, an exploration policy μ' is constructed by adding noise $$\mathcal{N}$$:</p>
<p>$$
\mu'(s) = \mu_\theta(s) + \mathcal{N}
$$</p>
<p>In addition, DDPG does soft updates ("conservative policy iteration") on the parameters of both actor and critic, with $$\tau \ll 1$$: $$\theta’ \leftarrow \tau \theta + (1 - \tau) \theta’$$. In this way, the target network values are constrained to change slowly, different from the design in DQN that the target network stays frozen for some period of time.</p>
<p>One detail in the paper that is particularly useful in robotics is on how to normalize the different physical units of low dimensional features. For example, a model is designed to learn a policy with the robot’s positions and velocities as input; these physical statistics are different by nature and even statistics of the same type may vary a lot across multiple robots. <a href="http://proceedings.mlr.press/v37/ioffe15.pdf" rel="nofollow">Batch normalization</a> is applied to fix it by normalizing every dimension across samples in one minibatch.</p>
<p>![DDPG]({{ '/assets/images/DDPG_algo.png' | relative_url }})
{: class="center"}
<em>Fig 3. DDPG Algorithm. (Image source: <a href="https://arxiv.org/pdf/1509.02971.pdf" rel="nofollow">Lillicrap, et al., 2015</a>)</em></p>
<h3><a id="user-content-d4pg" class="anchor" aria-hidden="true" href="#d4pg"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>D4PG</h3>
<p>[<a href="https://openreview.net/forum?id=SyZipzbCb" rel="nofollow">paper</a>|code (Search “github d4pg” and you will see a few.)]</p>
<p><strong>Distributed Distributional DDPG (D4PG)</strong> applies a set of improvements on DDPG to make it run in the distributional fashion.</p>
<p>(1) <strong>Distributional Critic</strong>: The critic estimates the expected Q value as a random variable ~ a distribution $$Z_w$$ parameterized by $$w$$ and therefore $$Q_w(s, a) = \mathbb{E} Z_w(x, a)$$. The loss for learning the distribution parameter is to minimize some measure of the distance between two distributions --- distributional TD error: $$L(w) = \mathbb{E}[d(\mathcal{T}<em>{\mu</em>\theta}, Z_{w’}(s, a), Z_w(s, a)]$$, where $$\mathcal{T}<em>{\mu</em>\theta}$$ is the Bellman operator.</p>
<p>The deterministic policy gradient update becomes:</p>
<p>$$
\begin{aligned}
\nabla_\theta J(\theta)
&amp;\approx \mathbb{E}<em>{\rho^\mu} [\nabla_a Q_w(s, a) \nabla</em>\theta \mu_\theta(s) \rvert_{a=\mu_\theta(s)}] &amp; \scriptstyle{\text{; gradient update in DPG}} \
&amp;= \mathbb{E}<em>{\rho^\mu} [\mathbb{E}[\nabla_a Q_w(s, a)] \nabla</em>\theta \mu_\theta(s) \rvert_{a=\mu_\theta(s)}] &amp; \scriptstyle{\text{; expectation of the Q-value distribution.}}
\end{aligned}
$$</p>
<p>(2) <strong>$$N$$-step returns</strong>: When calculating the TD error, D4PG computes TD(N) rather than TD(1) to incorporate rewards in more future steps. Thus the new TD target is:</p>
<p>$$
r(s_0, a_0) + \mathbb{E}[\sum_{n=1}^{N-1} r(s_n, a_n) + \gamma^N Q(s_N, \mu_\theta(s_N)) \vert s_0, a_0 ]
$$</p>
<p>(3) <strong>Multiple Distributed Parallel Actors</strong>: D4PG utilizes $$K$$ independent actors, gathering experience in parallel and feeding data into the same replay buffer.</p>
<p>(4) <strong>Prioritized Experience Replay (<a href="https://arxiv.org/abs/1511.05952" rel="nofollow">PER</a>)</strong>: The last piece of modification is to do sampling from the replay buffer of size $$R$$ with an non-uniform probability $$p_i$$. In this way, a sample $$i$$ has the probability $$(Rp_i)^{-1}$$ to be selected and thus the importance weight is $$(Rp_i)^{-1}$$.</p>
<p>![DDPG]({{ '/assets/images/D4PG_algo.png' | relative_url }})
{: class="center"}
<em>Fig. 4. D4PG algorithm (Image source: <a href="https://openreview.net/forum?id=SyZipzbCb" rel="nofollow">Barth-Maron, et al. 2018</a>); Note that in the original paper, the variable letters are chosen slightly differently from what in the post; i.e. I use $$\mu(.)$$ for representing a deterministic policy instead of $$\pi(.)$$.</em></p>
<h3><a id="user-content-maddpg" class="anchor" aria-hidden="true" href="#maddpg"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>MADDPG</h3>
<p>[<a href="https://arxiv.org/pdf/1706.02275.pdf" rel="nofollow">paper</a>|<a href="https://github.com/openai/maddpg">code</a>]</p>
<p><strong>Multi-agent DDPG</strong> (<strong>MADDPG</strong>) (<a href="https://arxiv.org/pdf/1706.02275.pdf" rel="nofollow">Lowe et al., 2017</a>)extends DDPG to an environment where multiple agents are coordinating to complete tasks with only local information. In the viewpoint of one agent, the environment is non-stationary as policies of other agents are quickly upgraded and remain unknown. MADDPG is an actor-critic model redesigned particularly for handling such a changing environment and interactions between agents.</p>
<p>The problem can be formalized in the multi-agent version of MDP, also known as <em>Markov games</em>. Say, there are N agents in total with a set of states $$\mathcal{S}$$. Each agent owns a set of possible action, $$\mathcal{A}_1, \dots, \mathcal{A}_N$$, and a set of observation, $$\mathcal{O}_1, \dots, \mathcal{O}_N$$. The state transition function involves all states, action and observation spaces  $$\mathcal{T}: \mathcal{S} \times \mathcal{A}_1 \times \dots \mathcal{A}<em>N \mapsto \mathcal{S}$$. Each agent’s stochastic policy only involves its own state and action: $$\pi</em>{\theta_i}: \mathcal{O}_i \times \mathcal{A}<em>i \mapsto [0, 1]$$, a probability distribution over actions given its own observation, or a deterministic policy: $$\mu</em>{\theta_i}: \mathcal{O}_i \mapsto \mathcal{A}_i$$.</p>
<p>Let $$\vec{o} = {o_1, \dots, o_N}$$, $$\vec{\mu} = {\mu_1, \dots, \mu_N}$$ and the policies are parameterized by $$\vec{\theta} = {\theta_1, \dots, \theta_N}$$.</p>
<p>The critic in MADDPG learns a centralized action-value function $$Q^\vec{\mu}_i(\vec{o}, a_1, \dots, a_N)$$ for the i-th agent, where $$a_1 \in \mathcal{A}_1, \dots, a_N \in \mathcal{A}_N$$ are actions of all agents. Each $$Q^\vec{\mu}_i$$ is learned separately for $$i=1, \dots, N$$ and therefore multiple agents can have arbitrary reward structures, including conflicting rewards in a competitive setting. Meanwhile, multiple actors, one for each agent, are exploring and upgrading the policy parameters $$\theta_i$$ on their own.</p>
<p><strong>Actor update</strong>:</p>
<p>$$
\nabla_{\theta_i} J(\theta_i) = \mathbb{E}<em>{\vec{o}, a \sim \mathcal{D}} [\nabla</em>{a_i} Q^{\vec{\mu}}<em>i (\vec{o}, a_1, \dots, a_N) \nabla</em>{\theta_i} \mu_{\theta_i}(o_i) \rvert_{a_i=\mu_{\theta_i}(o_i)} ]
$$</p>
<p>Where $$\mathcal{D}$$ is the memory buffer for experience replay, containing multiple episode samples $$(\vec{o}, a_1, \dots, a_N, r_1, \dots, r_N, \vec{o}')$$ --- given current observation $$\vec{o}$$, agents take action $$a_1, \dots, a_N$$ and get rewards $$r_1, \dots, r_N$$, leading to the new observation $$\vec{o}'$$.</p>
<p><strong>Critic update</strong>:</p>
<p>$$
\begin{aligned}
\mathcal{L}(\theta_i) &amp;= \mathbb{E}_{\vec{o}, a_1, \dots, a_N, r_1, \dots, r_N, \vec{o}'}[ (Q^{\vec{\mu}}_i(\vec{o}, a_1, \dots, a_N) - y)^2 ] &amp; \
\text{where } y &amp;= r_i + \gamma Q^{\vec{\mu}'}_i (\vec{o}', a'_1, \dots, a'<em>N) \rvert</em>{a'<em>j = \mu'</em>{\theta_j}} &amp; \scriptstyle{\text{; TD target!}}
\end{aligned}
$$</p>
<p>where $$\vec{\mu}’$$ are the target policies with delayed softly-updated parameters.</p>
<p>If the policies $$\vec{\mu}$$ are unknown during the critic update, we can ask each agent to learn and evolve its own approximation of others’ policies. Using the approximated policies, MADDPG still can learn efficiently although the inferred policies might not be accurate.</p>
<p>To mitigate the high variance triggered by the interaction between competing or collaborating agents in the environment, MADDPG proposed one more element - <em>policy ensembles</em>:</p>
<ol>
<li>Train K policies for one agent;</li>
<li>Pick a random policy for episode rollouts;</li>
<li>Take an ensemble of these K policies to do gradient update.</li>
</ol>
<p>In summary, MADDPG added three additional ingredients on top of DDPG to make it adapt to the multi-agent environment:</p>
<ul>
<li>Centralized critic + decentralized actors;</li>
<li>Actors are able to use estimated policies of other agents for learning;</li>
<li>Policy ensembling is good for reducing variance.</li>
</ul>
<p>![MADDPG]({{ '/assets/images/MADDPG.png' | relative_url }})
{: class="center" style="width: 70%;"}
<em>Fig. 5. The architecture design of MADDPG. (Image source: <a href="https://arxiv.org/pdf/1706.02275.pdf" rel="nofollow">Lowe et al., 2017</a>)</em></p>
<h3><a id="user-content-td3" class="anchor" aria-hidden="true" href="#td3"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>TD3</h3>
<p>TD3 = Twin Delayed Deep Deterministic</p>
<p>Scott Fujimoto, Herke van Hoof, and Dave Meger. "Addressing Function Approximation Error in Actor-Critic Methods." arXiv preprint arXiv:1802.09477 (2018).</p>
<p>TBA.</p>
<h3><a id="user-content-trpo" class="anchor" aria-hidden="true" href="#trpo"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>TRPO</h3>
<p>[<a href="https://arxiv.org/pdf/1502.05477.pdf" rel="nofollow">paper</a>|<a href="https://github.com/openai/baselines/tree/master/baselines/trpo_mpi">code</a>]</p>
<p>To improve training stability, we should avoid parameter updates that change the policy too much at one step. <strong>Trust region policy optimization (TRPO)</strong> (<a href="https://arxiv.org/pdf/1502.05477.pdf" rel="nofollow">Schulman, et al., 2015</a>) carries out this idea by enforcing a [KL divergence]({{ site.baseurl }}{% post_url 2017-08-20-from-GAN-to-WGAN %}#kullbackleibler-and-jensenshannon-divergence) constraint on the size of policy update at each iteration.</p>
<p>If off policy, the objective function measures the total advantage over the state visitation distribution and actions, while the rollout is following a different behavior policy $$\beta(a \vert s)$$:</p>
<p>$$
\begin{aligned}
J(\theta)
&amp;= \sum_{s \in \mathcal{S}} \rho^{\pi_{\theta_\text{old}}} \sum_{a \in \mathcal{A}} \big( \pi_\theta(a \vert s) \hat{A}<em>{\theta</em>\text{old}}(s, a) \big) &amp; \
&amp;= \sum_{s \in \mathcal{S}} \rho^{\pi_{\theta_\text{old}}} \sum_{a \in \mathcal{A}} \big( \beta(a \vert s) \frac{\pi_\theta(a \vert s)}{\beta(a \vert s)} \hat{A}<em>{\theta</em>\text{old}}(s, a) \big) &amp; \scriptstyle{\text{; Importance sampling}} \
&amp;= \mathbb{E}<em>{s \sim \rho^{\pi</em>{\theta_\text{old}}}, a \sim \beta} \big[ \frac{\pi_\theta(a \vert s)}{\beta(a \vert s)} \hat{A}<em>{\theta</em>\text{old}}(s, a) \big] &amp;
\end{aligned}
$$</p>
<p>where $$\theta_\text{old}$$ is the policy parameters before the update and thus known to us; $$\rho^{\pi_{\theta_\text{old}}}$$ is defined in the same way as <a href="#dpg">above</a>; $$\beta(a \vert s)$$ is the behavior policy for collecting trajectories. Noted that we use an estimated advantage $$\hat{A}(.)$$ rather than the true advantage function $$A(.)$$ because the true rewards are usually unknown.</p>
<p>If on policy,  the behavior policy is $$\pi_{\theta_\text{old}}(a \vert s)$$:</p>
<p>$$
J(\theta) = \mathbb{E}<em>{s \sim \rho^{\pi</em>{\theta_\text{old}}}, a \sim \pi_{\theta_\text{old}}} \big[ \frac{\pi_\theta(a \vert s)}{\pi_{\theta_\text{old}}(a \vert s)} \hat{A}<em>{\theta</em>\text{old}}(s, a) \big]
$$</p>
<p>TRPO aims to maximize the objective function $$J(\theta)$$ subject to, <em>trust region constraint</em> which enforces the distance between old and new policies measured by <a href="https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence" rel="nofollow">KL-divergence</a> to be small enough, within a parameter δ:</p>
<p>$$
\mathbb{E}<em>{s \sim \rho^{\pi</em>{\theta_\text{old}}}} [D_\text{KL}(\pi_{\theta_\text{old}}(.\vert s) | \pi_\theta(.\vert s)] \leq \delta
$$</p>
<p>In this way, the old and new policies would not diverge too much when this hard constraint is met. While still, TRPO can guarantee a monotonic improvement over policy iteration (Neat, right?). Please read the proof in the <a href="https://arxiv.org/pdf/1502.05477.pdf" rel="nofollow">paper</a> if interested :)</p>
<h3><a id="user-content-ppo" class="anchor" aria-hidden="true" href="#ppo"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>PPO</h3>
<p>[<a href="https://arxiv.org/pdf/1707.06347.pdf" rel="nofollow">paper</a>|<a href="https://github.com/openai/baselines/tree/master/baselines/ppo1">code</a>]</p>
<p>Given that TRPO is relatively complicated and we still want to implement a similar constraint, <strong>proximal policy optimization (PPO)</strong> simplifies it by using a clipped surrogate objective while retaining similar performance.</p>
<p>First, let's denote the probability ratio between old and new policies as:</p>
<p>$$
r(\theta) = \frac{\pi_\theta(a \vert s)}{\pi_{\theta_\text{old}}(a \vert s)}
$$</p>
<p>Then, the objective function of TRPO (on policy) becomes:</p>
<p>$$
J^\text{TRPO} (\theta) = \mathbb{E} [ r(\theta) \hat{A}<em>{\theta</em>\text{old}}(s, a) ]
$$</p>
<p>Without a limitation on the distance between $$\theta_\text{old}$$ and $$\theta$$, to maximize $$J^\text{TRPO} (\theta)$$ would lead to instability with extremely large parameter updates and big policy ratios. PPO imposes the constraint by forcing r(θ) to stay within a small interval around 1, precisely [1-ε, 1+ε], where ε is a hyperparameter.</p>
<p>$$
J^\text{CLIP} (\theta) = \mathbb{E} [ \min( r(\theta) \hat{A}<em>{\theta</em>\text{old}}(s, a), \text{clip}(r(\theta), 1 - \epsilon, 1 + \epsilon) \hat{A}<em>{\theta</em>\text{old}}(s, a))]
$$</p>
<p>The function $$\text{clip}(r(\theta), 1 - \epsilon, 1 + \epsilon)$$ clips the ratio within [1-ε, 1+ε]. The objective function of PPO takes the minimum one between the original value and the clipped version and therefore we lose the motivation for increasing the policy update to extremes for better rewards.</p>
<p>When applying PPO on the network architecture with shared parameters for both policy (actor) and value (critic) functions, in addition to the clipped reward, the objective function is augmented with an error term on the value estimation (formula in red) and an entropy term (formula in blue) to encourage sufficient exploration.</p>
<p>$$
J^\text{CLIP'} (\theta) = \mathbb{E} [ J^\text{CLIP} (\theta) - \color{red}{c_1 (V_\theta(s) - V_\text{target})^2} + \color{blue}{c_2 H(s, \pi_\theta(.))} ]
$$</p>
<p>where Both $$c_1$$ and $$c_2$$ are two hyperparameter constants.</p>
<p>PPO has been tested on a set of benchmark tasks and proved to produce awesome results with much greater simplicity.</p>
<h3><a id="user-content-acer" class="anchor" aria-hidden="true" href="#acer"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>ACER</h3>
<p>[<a href="https://arxiv.org/pdf/1611.01224.pdf" rel="nofollow">paper</a>|<a href="https://github.com/openai/baselines/tree/master/baselines/acer">code</a>]</p>
<p><strong>ACER</strong>, short for <strong>actor-critic with experience replay</strong> (<a href="https://arxiv.org/pdf/1611.01224.pdf" rel="nofollow">Wang, et al., 2017</a>), is an off-policy actor-critic model with experience replay, greatly increasing the sample efficiency and decreasing the data correlation. A3C builds up the foundation for ACER, but it is on policy; ACER is A3C’s off-policy counterpart. The major obstacle to making A3C off policy is how to control the stability of the off-policy estimator. ACER proposes three designs to overcome it:</p>
<ul>
<li>Use Retrace Q-value estimation;</li>
<li>Truncate the importance weights with bias correction;</li>
<li>Apply efficient TRPO.</li>
</ul>
<p><strong>Retrace Q-value Estimation</strong></p>
<p><a href="http://papers.nips.cc/paper/6538-safe-and-efficient-off-policy-reinforcement-learning.pdf" rel="nofollow"><em>Retrace</em></a> is an off-policy return-based Q-value estimation algorithm with a nice guarantee for convergence for any target and behavior policy pair (π, β), plus good data efficiency.</p>
<p>Recall how TD learning works for prediction:</p>
<ol>
<li>Compute TD error: $$\delta_t = R_t + \gamma \mathbb{E}<em>{a \sim \pi} Q(S</em>{t+1}, a) - Q(S_t, A_t)$$; the term $$r_t + \gamma \mathbb{E}<em>{a \sim \pi} Q(s</em>{t+1}, a) $$ is known as “TD target”. The expectation $$\mathbb{E}_{a \sim \pi}$$ is used because for the future step the best estimation we can make is what the return would be if we follow the current policy π.</li>
<li>Update the value by correcting the error to move toward the goal: $$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \delta_t$$. In other words, the incremental update on Q is proportional to the TD error: $$\Delta Q(S_t, A_t) = \alpha \delta_t$$.</li>
</ol>
<p>When the rollout is off policy, we need to apply importance sampling on the Q update:</p>
<p>$$
\Delta Q^\text{imp}(S_t, A_t)
= \gamma^t \prod_{1 \leq \tau \leq t} \frac{\pi(A_\tau \vert S_\tau)}{\beta(A_\tau \vert S_\tau)} \delta_t
$$</p>
<p>The product of importance weights looks pretty scary when we start imagining how it can cause super high variance and even explode. Retrace Q-value estimation method modifies $$\Delta Q$$ to have importance weights truncated by no more than a constant c:</p>
<p>$$
\Delta Q^\text{ret}(S_t, A_t)
= \gamma^t \prod_{1 \leq \tau \leq t} \min(c, \frac{\pi(A_\tau \vert S_\tau)}{\beta(A_\tau \vert S_\tau)})  \delta_t
$$</p>
<p>ACER uses $$Q^\text{ret}$$ as the target to train the critic by minimizing the L2 error term: $$(Q^\text{ret}(s, a) - Q(s, a))^2$$.</p>
<p><strong>Importance weights truncation</strong></p>
<p>To reduce the high variance of the policy gradient $$\hat{g}$$, ACER truncates the importance weights by a constant c, plus a correction term. The label $$\hat{g}_t^\text{acer}$$ is the ACER policy gradient at time t.</p>
<p>$$
\begin{aligned}
\hat{g}<em>t^\text{acer}
= &amp; \omega_t \big( Q^\text{ret}(S_t, A_t) - V</em>{\theta_v}(S_t) \big) \nabla_\theta \ln \pi_\theta(A_t \vert S_t)
&amp; \scriptstyle{\text{; Let }\omega_t=\frac{\pi(A_t \vert S_t)}{\beta(A_t \vert S_t)}} \
= &amp; \color{blue}{\min(c, \omega_t) \big( Q^\text{ret}(S_t, A_t) - V_w(S_t) \big) \nabla_\theta \ln \pi_\theta(A_t \vert S_t)} \
&amp; + \color{red}{\mathbb{E}<em>{a \sim \pi} \big[ \max(0, \frac{\omega_t(a) - c}{\omega_t(a)}) \big( Q_w(S_t, a) - V_w(S_t) \big) \nabla</em>\theta \ln \pi_\theta(a \vert S_t) \big]}
&amp; \scriptstyle{\text{; Let }\omega_t (a) =\frac{\pi(a \vert S_t)}{\beta(a \vert S_t)}}
\end{aligned}
$$</p>
<p>where $$Q_w(.)$$ and $$V_w(.)$$ are value functions predicted by the critic with parameter w. The first term (blue) contains the clipped important weight. The clipping helps reduce the variance, in addition to subtracting state value function $$V_w(.)$$ as a baseline. The second term (red) makes a correction to achieve unbiased estimation.</p>
<p><strong>Efficient TRPO</strong></p>
<p>Furthermore, ACER adopts the idea of TRPO but with a small adjustment to make it more computationally efficient: rather than measuring the KL divergence between policies before and after one update, ACER maintains a running average of past policies and forces the updated policy to not deviate far from this average.</p>
<p>The ACER <a href="https://arxiv.org/pdf/1611.01224.pdf" rel="nofollow">paper</a> is pretty dense with many equations. Hopefully, with the prior knowledge on TD learning, Q-learning, importance sampling and TRPO, you will find the <a href="https://arxiv.org/pdf/1611.01224.pdf" rel="nofollow">paper</a> slightly easier to follow :)</p>
<h3><a id="user-content-actkr" class="anchor" aria-hidden="true" href="#actkr"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>ACTKR</h3>
<p>[<a href="https://arxiv.org/pdf/1708.05144.pdf" rel="nofollow">paper</a>|<a href="https://github.com/openai/baselines/tree/master/baselines/acktr">code</a>]</p>
<p><strong>ACKTR (actor-critic using Kronecker-factored trust region)</strong> (<a href="https://arxiv.org/pdf/1708.05144.pdf" rel="nofollow">Yuhuai Wu, et al., 2017</a>) proposed to use Kronecker-factored approximation curvature (<a href="https://arxiv.org/pdf/1503.05671.pdf" rel="nofollow">K-FAC</a>) to do the gradient update for both the critic and actor. K-FAC made an improvement on the computation of <em>natural gradient</em>, which is quite different from our <em>standard gradient</em>. <a href="http://kvfrans.com/a-intuitive-explanation-of-natural-gradient-descent/" rel="nofollow">Here</a> is a nice, intuitive explanation of natural gradient. One sentence summary is probably:</p>
<blockquote>
<p>“we first consider all combinations of parameters that result in a new network a constant KL divergence away from the old network. This constant value can be viewed as the step size or learning rate. Out of all these possible combinations, we choose the one that minimizes our loss function.”</p>
</blockquote>
<p>I listed ACTKR here mainly for the completeness of this post, but I would not dive into details, as it involves a lot of theoretical knowledge on natural gradient and optimization methods. If interested, check these papers/posts, before reading the ACKTR paper:</p>
<ul>
<li>Amari. <a href="http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.452.7280&amp;rep=rep1&amp;type=pdf" rel="nofollow">Natural Gradient Works Efficiently in Learning</a>. 1998</li>
<li>Kakade. <a href="https://papers.nips.cc/paper/2073-a-natural-policy-gradient.pdf" rel="nofollow">A Natural Policy Gradient</a>. 2002</li>
<li><a href="http://kvfrans.com/a-intuitive-explanation-of-natural-gradient-descent/" rel="nofollow">A intuitive explanation of natural gradient descent</a></li>
<li><a href="https://en.wikipedia.org/wiki/Kronecker_product" rel="nofollow">Wiki: Kronecker product</a></li>
<li>Martens &amp; Grosse. <a href="http://proceedings.mlr.press/v37/martens15.pdf" rel="nofollow">Optimizing neural networks with kronecker-factored approximate curvature.</a> 2015.</li>
</ul>
<p>Here is a high level summary from the K-FAC <a href="https://arxiv.org/pdf/1503.05671.pdf" rel="nofollow">paper</a>:</p>
<blockquote>
<p>"This approximation is built in two stages. In the first, the rows and columns of the Fisher are divided into groups, each of which corresponds to all the weights in a given layer, and this gives rise to a block-partitioning of the matrix. These blocks are then approximated as Kronecker products between much smaller matrices, which we show is equivalent to making certain approximating assumptions regarding the statistics of the network’s gradients.</p>
</blockquote>
<blockquote>
<p>In the second stage, this matrix is further approximated as having an inverse which is either block-diagonal or block-tridiagonal. We justify this approximation through a careful examination of the relationships between inverse covariances, tree-structured graphical models, and linear regression. Notably, this justification doesn’t apply to the Fisher itself, and our experiments confirm that while the inverse Fisher does indeed possess this structure (approximately), the Fisher itself does not."</p>
</blockquote>
<h3><a id="user-content-soft-actor-critic" class="anchor" aria-hidden="true" href="#soft-actor-critic"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Soft Actor-Critic</h3>
<p>[<a href="https://arxiv.org/abs/1801.01290" rel="nofollow">paper</a>|<a href="https://github.com/haarnoja/sac">code</a>]</p>
<p><strong>Soft Actor-Critic (SAC)</strong> (<a href="https://arxiv.org/abs/1801.01290" rel="nofollow">Haarnoja et al. 2018</a>) incorporates the entropy measure of the policy into the reward to encourage exploration: we expect to learn a policy that acts as randomly as possible while it is still able to succeed at the task. It is an off-policy actor-critic model following the maximum entropy reinforcement learning framework. A precedent work is <a href="https://arxiv.org/abs/1702.08165" rel="nofollow">Soft Q-learning</a>.</p>
<p>Three key components in SAC:</p>
<ul>
<li>An <a href="#actor-critic">actor-critic</a> architecture with separate policy and value function networks;</li>
<li>An <a href="#off-policy-policy-gradient">off-policy</a> formulation that enables reuse of previously collected data for efficiency;</li>
<li>Entropy maximization to enable stability and exploration.</li>
</ul>
<p>The policy is trained with the objective to maximize the expected return and the entropy at the same time:</p>
<p>$$
J(\theta) = \sum_{t=1}^T \mathbb{E}<em>{(s_t, a_t) \sim \rho</em>{\pi_\theta}} [r(s_t, a_t) + \alpha \mathcal{H}(\pi_\theta(.\vert s_t))]
$$</p>
<p>where $$\mathcal{H}(.)$$ is the entropy measure and $$\alpha$$ controls how important the entropy term is, known as <strong>temperature parameter</strong>. The entropy maximization leads to policies that can (1) explore more and (2) capture multiple modes of near-optimal strategies (i.e., if there exist multiple options that seem to be equally good, the policy should assign each with an equal probability to be chosen).</p>
<p>Precisely, SAC aims to learn three functions:</p>
<ul>
<li>The policy with parameter $$\theta$$, $$\pi_\theta$$.</li>
<li>Soft Q-value function parameterized by $$w$$, $$Q_w$$.</li>
<li>Soft state value function parameterized by $$\psi$$, $$V_\psi$$; theoretically we can infer $$V$$ by knowing $$Q$$ and $$\pi$$, but in practice, it helps stabilize the training.</li>
</ul>
<p>Soft Q-value and soft state value are defined as:</p>
<p>$$
\begin{aligned}
Q(s_t, a_t) &amp;= r(s_t, a_t) + \gamma \mathbb{E}<em>{s</em>{t+1} \sim \rho_{\pi}(s)} [V(s_{t+1})] &amp; \scriptstyle{\text{; according to Bellman equation.}}\
V(s_t) &amp;= \mathbb{E}_{a_t \sim \pi} [Q(s_t, a_t) - \log \pi(s_t, a_t)] &amp;
\end{aligned}
$$</p>
<p>$$\rho_\pi(s)$$ and $$\rho_\pi(s, a)$$ denote the state and the state-action marginals of the state distribution induced by the policy $$\pi(a \vert s)$$; see the similar definitions in <a href="#dpg">DPG</a> section.</p>
<p>The soft state value function is trained to minimize the mean squared error:</p>
<p>$$
\begin{aligned}
J_V(\psi) &amp;= \mathbb{E}<em>{s_t \sim \mathcal{D}} [\frac{1}{2} \big(V</em>\psi(s_t) - \mathbb{E}[Q_w(s_t, a_t) - \log \pi_\theta(a_t \vert s_t)] \big)^2] \
\text{with gradient: }\nabla_\psi J_V(\psi) &amp;= \nabla_\psi V_\psi(s_t)\big( V_\psi(s_t) - Q_w(s_t, a_t) + \log \pi_\theta (a_t \vert s_t) \big)
\end{aligned}
$$</p>
<p>where $$\mathcal{D}$$ is the replay buffer.</p>
<p>The soft Q function is trained to minimize the soft Bellman residual:</p>
<p>$$
\begin{aligned}
J_Q(w) &amp;= \mathbb{E}<em>{(s_t, a_t) \sim \mathcal{D}} [\frac{1}{2}\big( Q_w(s_t, a_t) - (r(s_t, a_t) + \gamma \mathbb{E}</em>{s_{t+1} \sim \rho_\pi(s)}[V_{\bar{\psi}}(s_{t+1})]) \big)^2] \
\text{with gradient: } \nabla_w J_Q(w) &amp;= \nabla_w Q_w(s_t, a_t) \big( Q_w(s_t, a_t) - r(s_t, a_t) - \gamma V_{\bar{\psi}}(s_{t+1})\big)
\end{aligned}
$$</p>
<p>where $$\bar{\psi}$$ is the target value function which is the exponential moving average (or only gets updated periodically in a “hard” way), just like how the parameter of the target Q network is treated in [DQN]({{ site.baseurl }}{% post_url 2018-02-19-a-long-peek-into-reinforcement-learning%}#deep-q-network) to stabilize the training.</p>
<p>SAC updates the policy to minimize the <a href="https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence" rel="nofollow">KL-divergence</a>:</p>
<p>$$
\begin{aligned}
\pi_\text{new} &amp;= \arg\min_{\pi' \in \Pi} \pi_\text{old} D_\text{KL} \big( \pi'(.\vert s_t) | \exp(Q^{\pi_\text{old}}(s_t, .) - \log Z^{\pi_\text{old}}(s_t)) \big) \
\text{objective for update: } J_\pi(\theta) &amp;= D_\text{KL} \big( \pi_\theta(. \vert s_t) | \exp(Q_w(s_t, .) - \log Z_w(s_t)) \big)
\end{aligned}
$$</p>
<p>where $$\Pi$$ is the set of potential policies that we can model our policy as to keep them tractable; for example, $$\Pi$$ can be the family of Gaussian mixture distributions, expensive to model but highly expressive and still tractable. $$Z^{\pi_\text{old}}(s_t)$$ is the partition function. How to minimize $$J_\pi(\theta)$$ depends our choice of $$\Pi$$.</p>
<p>This update guarantees that $$Q^{\pi_\text{new}}(s_t, a_t) \geq Q^{\pi_\text{old}}(s_t, a_t)$$, please check the proof on this lemma in the Appendix B.2 in the original <a href="https://arxiv.org/abs/1801.01290" rel="nofollow">paper</a>.</p>
<p>Once we have defined the objective functions and gradients for soft action-state value, soft state value and the policy network, the soft actor-critic algorithm is straightforward:</p>
<p>![SAC]({{ '/assets/images/SAC_algo.png' | relative_url }})
{: class="center" style="width: 85%;"}
<em>Fig. 6. The soft actor-critic algorithm.</em></p>
<h2><a id="user-content-quick-summary" class="anchor" aria-hidden="true" href="#quick-summary"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Quick Summary</h2>
<p>After reading through all the algorithms above, I list a few building blocks or principles that seem to be common among them:</p>
<ul>
<li>Try to reduce the variance and keep the bias unchanged.</li>
<li>Off-policy gives us better exploration and helps us use data samples more efficiently.</li>
<li>Experience replay (training data sampled from a replay memory buffer);</li>
<li>Target network that is either frozen periodically or updated slower than the actively learned policy network;</li>
<li>Batch normalization;</li>
<li>Entropy-regularized reward;</li>
<li>The critic and actor can share lower layer parameters of the network and two output heads for policy and value functions.</li>
<li>It is possible to learn with deterministic policy rather than stochastic one.</li>
<li>Put constraint on the divergence between policy updates.</li>
<li>New optimization methods (such as K-FAC).</li>
<li>Entropy maximization of the policy helps encourage exploration.</li>
<li>TBA more.</li>
</ul>
<h2><a id="user-content-references" class="anchor" aria-hidden="true" href="#references"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>References</h2>
<p>[1] jeremykun.com <a href="https://jeremykun.com/2015/04/06/markov-chain-monte-carlo-without-all-the-bullshit/" rel="nofollow">Markov Chain Monte Carlo Without all the Bullshit</a></p>
<p>[2] Richard S. Sutton and Andrew G. Barto. <a href="http://incompleteideas.net/book/bookdraft2017nov5.pdf" rel="nofollow">Reinforcement Learning: An Introduction; 2nd Edition</a>. 2017.</p>
<p>[3] John Schulman, et al. <a href="https://arxiv.org/pdf/1506.02438.pdf" rel="nofollow">"High-dimensional continuous control using generalized advantage estimation."</a> ICLR 2016.</p>
<p>[4] Thomas Degris, Martha White, and Richard S. Sutton. <a href="https://arxiv.org/pdf/1205.4839.pdf" rel="nofollow">"Off-policy actor-critic."</a> ICML 2012.</p>
<p>[5] timvieira.github.io <a href="http://timvieira.github.io/blog/post/2014/12/21/importance-sampling/" rel="nofollow">Importance sampling</a></p>
<p>[6] Mnih, Volodymyr, et al. <a href="https://arxiv.org/abs/1602.01783" rel="nofollow">"Asynchronous methods for deep reinforcement learning."</a> ICML. 2016.</p>
<p>[7] David Silver, et al. <a href="https://hal.inria.fr/file/index/docid/938992/filename/dpg-icml2014.pdf" rel="nofollow">"Deterministic policy gradient algorithms."</a> ICML. 2014.</p>
<p>[8] Timothy P. Lillicrap, et al. <a href="https://arxiv.org/pdf/1509.02971.pdf" rel="nofollow">"Continuous control with deep reinforcement learning."</a> arXiv preprint arXiv:1509.02971 (2015).</p>
<p>[9] Ryan Lowe, et al. <a href="https://arxiv.org/pdf/1706.02275.pdf" rel="nofollow">"Multi-agent actor-critic for mixed cooperative-competitive environments."</a> NIPS. 2017.</p>
<p>[10] John Schulman, et al. <a href="https://arxiv.org/pdf/1502.05477.pdf" rel="nofollow">"Trust region policy optimization."</a> ICML. 2015.</p>
<p>[11] Ziyu Wang, et al. <a href="https://arxiv.org/pdf/1611.01224.pdf" rel="nofollow">"Sample efficient actor-critic with experience replay."</a> ICLR 2017.</p>
<p>[12] Rémi Munos, Tom Stepleton, Anna Harutyunyan, and Marc Bellemare. <a href="http://papers.nips.cc/paper/6538-safe-and-efficient-off-policy-reinforcement-learning.pdf" rel="nofollow">"Safe and efficient off-policy reinforcement learning"</a> NIPS. 2016.</p>
<p>[13] Yuhuai Wu, et al. <a href="https://arxiv.org/pdf/1708.05144.pdf" rel="nofollow">"Scalable trust-region method for deep reinforcement learning using Kronecker-factored approximation."</a> NIPS. 2017.</p>
<p>[14] kvfrans.com <a href="http://kvfrans.com/a-intuitive-explanation-of-natural-gradient-descent/" rel="nofollow">A intuitive explanation of natural gradient descent</a></p>
<p>[15] Sham Kakade. <a href="https://papers.nips.cc/paper/2073-a-natural-policy-gradient.pdf" rel="nofollow">"A Natural Policy Gradient."</a>. NIPS. 2002.</p>
<p>[16] <a href="https://danieltakeshi.github.io/2017/03/28/going-deeper-into-reinforcement-learning-fundamentals-of-policy-gradients/" rel="nofollow">"Going Deeper Into Reinforcement Learning: Fundamentals of Policy Gradients."</a> - Seita's Place, Mar 2017.</p>
<p>[17] <a href="https://danieltakeshi.github.io/2017/04/02/notes-on-the-generalized-advantage-estimation-paper/" rel="nofollow">"Notes on the Generalized Advantage Estimation Paper."</a> - Seita's Place, Apr, 2017.</p>
<p>[18] Gabriel Barth-Maron, et al. <a href="https://arxiv.org/pdf/1804.08617.pdf" rel="nofollow">"Distributed Distributional Deterministic Policy Gradients."</a> ICLR 2018 poster.</p>
<p>[19] Tuomas Haarnoja, Aurick Zhou, Pieter Abbeel, and Sergey Levine. <a href="https://arxiv.org/pdf/1801.01290.pdf" rel="nofollow">"Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement Learning with a Stochastic Actor."</a> arXiv preprint arXiv:1801.01290 (2018).</p>
</article>
  </div>

  </div>

  <details class="details-reset details-overlay details-overlay-dark">
    <summary data-hotkey="l" aria-label="Jump to line"></summary>
    <details-dialog class="Box Box--overlay d-flex flex-column anim-fade-in fast linejump" aria-label="Jump to line">
      <!-- '"` --><!-- </textarea></xmp> --></option></form><form class="js-jump-to-line-form Box-body d-flex" action="" accept-charset="UTF-8" method="get"><input name="utf8" type="hidden" value="&#x2713;" />
        <input class="form-control flex-auto mr-3 linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" aria-label="Jump to line" autofocus>
        <button type="submit" class="btn" data-close-dialog>Go</button>
</form>    </details-dialog>
  </details>


  </div>
  <div class="modal-backdrop js-touch-events"></div>
</div>

    </div>
  </div>

  </div>

        
<div class="footer container-lg px-3" role="contentinfo">
  <div class="position-relative d-flex flex-justify-between pt-6 pb-2 mt-6 f6 text-gray border-top border-gray-light ">
    <ul class="list-style-none d-flex flex-wrap ">
      <li class="mr-3">&copy; 2018 <span title="0.17088s from unicorn-1537053187-mhzz5">GitHub</span>, Inc.</li>
        <li class="mr-3"><a data-ga-click="Footer, go to terms, text:terms" href="https://github.com/site/terms">Terms</a></li>
        <li class="mr-3"><a data-ga-click="Footer, go to privacy, text:privacy" href="https://github.com/site/privacy">Privacy</a></li>
        <li class="mr-3"><a href="https://help.github.com/articles/github-security/" data-ga-click="Footer, go to security, text:security">Security</a></li>
        <li class="mr-3"><a href="https://status.github.com/" data-ga-click="Footer, go to status, text:status">Status</a></li>
        <li><a data-ga-click="Footer, go to help, text:help" href="https://help.github.com">Help</a></li>
    </ul>

    <a aria-label="Homepage" title="GitHub" class="footer-octicon mr-lg-4" href="https://github.com">
      <svg height="24" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="24" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
</a>
   <ul class="list-style-none d-flex flex-wrap ">
        <li class="mr-3"><a data-ga-click="Footer, go to contact, text:contact" href="https://github.com/contact">Contact GitHub</a></li>
        <li class="mr-3"><a href="https://github.com/pricing" data-ga-click="Footer, go to Pricing, text:Pricing">Pricing</a></li>
      <li class="mr-3"><a href="https://developer.github.com" data-ga-click="Footer, go to api, text:api">API</a></li>
      <li class="mr-3"><a href="https://training.github.com" data-ga-click="Footer, go to training, text:training">Training</a></li>
        <li class="mr-3"><a href="https://blog.github.com" data-ga-click="Footer, go to blog, text:blog">Blog</a></li>
        <li><a data-ga-click="Footer, go to about, text:about" href="https://github.com/about">About</a></li>

    </ul>
  </div>
  <div class="d-flex flex-justify-center pb-6">
    <span class="f6 text-gray-light"></span>
  </div>
</div>



  <div id="ajax-error-message" class="ajax-error-message flash flash-error">
    <svg class="octicon octicon-alert" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"/></svg>
    <button type="button" class="flash-close js-ajax-error-dismiss" aria-label="Dismiss error">
      <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/></svg>
    </button>
    You can’t perform that action at this time.
  </div>


    <script crossorigin="anonymous" integrity="sha512-RJ1ufbxsSbKjRCyYvinsPNKvTBvcvvKUvEOJ8g+GjtWI5SuRr+QPBlZcvRDws4H9YwAgdQFcGxfL8UbwEfdI7A==" type="application/javascript" src="https://assets-cdn.github.com/assets/compat-daf14de28fadf1e2bc40d100cb773e2b.js"></script>
    <script crossorigin="anonymous" integrity="sha512-gB7wk1UK1eRelxt6Mw7cTmQMyE0gvGHeN8NqNpMjAN8Hmeb3GROvgqYWVvAro9tsEj+0e0HMkGbXe60gDNkNLw==" type="application/javascript" src="https://assets-cdn.github.com/assets/frameworks-bb6580f9e96dfbf21467d33218598f2c.js"></script>
    
    <script crossorigin="anonymous" async="async" integrity="sha512-qfUyw5LpNPTPv/9yViM2A7A4aveGNTGoub9QL3/+8d0v2MoqXYimROvZCbTrY5R71lHnENoE7c8m+G1OhLsG/Q==" type="application/javascript" src="https://assets-cdn.github.com/assets/github-5cb13afb52d05fe3d7a4f79a51a6b3c8.js"></script>
    
    
    
  <div class="js-stale-session-flash stale-session-flash flash flash-warn flash-banner d-none">
    <svg class="octicon octicon-alert" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"/></svg>
    <span class="signed-in-tab-flash">You signed in with another tab or window. <a href="">Reload</a> to refresh your session.</span>
    <span class="signed-out-tab-flash">You signed out in another tab or window. <a href="">Reload</a> to refresh your session.</span>
  </div>
  <div class="facebox" id="facebox" style="display:none;">
  <div class="facebox-popup">
    <div class="facebox-content" role="dialog" aria-labelledby="facebox-header" aria-describedby="facebox-description">
    </div>
    <button type="button" class="facebox-close js-facebox-close" aria-label="Close modal">
      <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/></svg>
    </button>
  </div>
</div>

  <template id="site-details-dialog">
  <details class="details-reset details-overlay details-overlay-dark lh-default text-gray-dark" open>
    <summary aria-haspopup="dialog" aria-label="Close dialog"></summary>
    <details-dialog class="Box Box--overlay d-flex flex-column anim-fade-in fast">
      <button class="Box-btn-octicon m-0 btn-octicon position-absolute right-0 top-0" type="button" aria-label="Close dialog" data-close-dialog>
        <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/></svg>
      </button>
      <div class="octocat-spinner my-6 js-details-dialog-spinner"></div>
    </details-dialog>
  </details>
</template>

  <div class="Popover js-hovercard-content position-absolute" style="display: none; outline: none;" tabindex="0">
  <div class="Popover-message Popover-message--bottom-left Popover-message--large Box box-shadow-large" style="width:360px;">
  </div>
</div>

<div id="hovercard-aria-description" class="sr-only">
  Press h to open a hovercard with more details.
</div>


  </body>
</html>

