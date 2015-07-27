## 3. Configure the home page

Let's spruce things up and add a custom home page.

You already know how to configure a `file` resource; append one that configures the default home page, <code class="file-path">c:\inetpub\wwwroot\Default.htm</code>, to the end of <code class="file-path">webserver.rb</code>. The entire recipe now looks like this.

[TIP] Although we believe typing in the code and commands is a great way to learn, remember you can copy the text from the code and terminal boxes and paste them into your session.

```ruby-Win32
# ~\chef-repo\webserver.rb
powershell_script 'Install IIS' do
  code 'Add-WindowsFeature Web-Server'
  guard_interpreter :powershell_script
  not_if "(Get-WindowsFeature -Name Web-Server).Installed"
end

service 'w3svc' do
  action [:enable, :start]
end

file 'c:\inetpub\wwwroot\Default.htm' do
  content '<html>
  <body>
    <h1>hello world</h1>
  </body>
</html>'
end
```

Now apply it.

```ps
# ~\chef-repo
$ chef-apply webserver.rb
Recipe: (chef-apply cookbook)::(chef-apply recipe)
  * powershell_script[Install IIS] action run (skipped due to not_if)
  * service[w3svc] action enable (up to date)
  * service[w3svc] action start (up to date)
  * file[c:\inetpub\wwwroot\Default.htm] action create
    - create new file c:\inetpub\wwwroot\Default.htm
    - update content in file c:\inetpub\wwwroot\Default.htm from none to 2914aa
    --- c:\inetpub\wwwroot\Default.htm  2014-08-19 21:19:58.000000000 +0000
    +++ C:/Users/ADMINI~1/AppData/Local/Temp/2/Default.htm20140819-596-1vshr64      2014-08-19 21:19:58.000000000 +0000
    @@ -1 +1,6 @@
    +<html>
    +  <body>
    +    <h1>hello world</h1>
    +  </body>
    +</html>
```