## 5. Delete the MOTD file

OK, you're done experimenting with the MOTD, so let's clean up. From your <code class="file-path">~/chef-repo</code> directory, create a new file named <code class="file-path">goodbye.rb</code> and save this content to it.

```ruby
# goodbye.rb
file 'motd' do
  action :delete
end
```

Now apply <code class="file-path">goodbye.rb</code> to delete the file.

```bash
# ~/chef-repo
$ chef-apply goodbye.rb
Recipe: (chef-apply cookbook)::(chef-apply recipe)
  * file[motd] action delete
    - delete file motd
```

The output shows that <code class="file-path">motd</code> is now gone, but let's prove it.

```bash
# ~/chef-repo
$ more motd
motd: No such file or directory
```