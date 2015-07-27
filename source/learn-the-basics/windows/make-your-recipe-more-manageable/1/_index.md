## 1. Create a cookbook

First, from your <code class="file-path">~\chef-repo</code> directory, create a <code class="file-path">cookbooks</code> directory and `cd` there.

```ps
# ~\chef-repo
$ mkdir cookbooks
$ cd cookbooks
```

Now run the `chef` command to generate a cookbook named `learn_chef_iis`.

```ps
# ~\chef-repo\cookbooks
$ chef generate cookbook learn_chef_iis
```

Here's the directory structure that the command created.

```ps
# ~\chef-repo\cookbooks
$ tree /F
Folder PATH listing
Volume serial number is 5E71-6BA3
C:.
└───learn_chef_iis
    │   .kitchen.yml
    │   Berksfile
    │   chefignore
    │   metadata.rb
    │   README.md
    │
    └───recipes
            default.rb
```

Note the default recipe, named <code class="file-path">default.rb</code>. This is where we'll move our IIS recipe in a moment.