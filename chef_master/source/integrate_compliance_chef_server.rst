=====================================================
Integrate Compliance w/Chef Server
=====================================================

.. include:: ../../includes_compliance/includes_compliance_integrate_chef_server.rst

Prerequisites
=====================================================
The integration of |chef compliance| with the |chef server| requires the following:

* |chef compliance| server, version 1.0 (or later)
* The |chef server|, version 12.4.1 (or later), configured as a standalone server
* A time synchronization policy is in place, such as |ntp|; authentication algorithms are sensitive to time drift
* |chef compliance| and |chef server| communicate between each other over port TCP/443, which must allow bidirectional communication to support both single sign-on and auditing use cases


Integration steps
=====================================================
To complete the integration you need shell access to |chef server_title| and |chef compliance| servers and go through these steps:

Prepare |chef compliance|
-----------------------------------------------------
Run the following command from the shell, confirm or provide values when prompted:

.. code-block:: bash

   sudo -i
   chef-compliance-ctl connect chef-server


The [default] values should work for most users. Here's a sample output received for a |chef compliance| server with a ``compliance.test`` hostname. I'm skipping SSL validation here due to the self-signed certificate used by the |chef compliance| server:

.. code-block:: bash

   Please confirm or provide values for:
    * Chef Server (OCID) APP-ID for Compliance [compliance_server]:
    * Name for Chef Server Authentication in Chef Compliance [Chef Server]:
    * Allow Self-signed SSL certificates [false]: true
    * Compliance Server URL [https://compliance.test]:

   Generating new shared secret for chef-gate...
     Successfully generated secret for chef-gate
   Please reconfigure Chef Compliance by running this command:
   chef-compliance-ctl reconfigure

   Please run the command delimited by --- on the Chef Server node as administrator:
   ---
   CHEF_APP_ID="compliance_server" AUTH_ID="Chef Server" COMPLIANCE_URL="https://compliance.test" INSECURE_SSL="true" CHEF_GATE_COMPLIANCE_SECRET="7fef11649f95d4de9e9334b103144f58e3e1fde12f49e5a70579143a7b48f7ebf25a0dab9c58b86460e392cb942a95b345bb" OIDC_CLIENT_ID="l0IL_ak15qZzkQtP_Orc5E0Gdka_3CYFVWHIjLKoh5o=@compliance.test" bash <( curl -k https://compliance.test/static/chef-gate.sh )
   ---

You can also run the command in a non-interactive mode, here's an example:

.. code-block:: bash

   sudo -i
   chef-compliance-ctl connect chef-server --non-interactive true --chef-app-id 'compliance_server' --auth-id 'Chef Server' --insecure true --compliance-url 'https://compliance.test'

Copy the command delimited by --- and run:

.. code-block:: bash

   sudo -i
   chef-compliance-ctl reconfigure

This will create a file under ``/opt/chef-compliance/sv/core/env/CHEF_GATE_COMPLIANCE_SECRET``

Restart the |chef compliance| core service now:

.. code-block:: bash

   sudo -i
   chef-compliance-ctl restart core


Configure |chef server_title|
-----------------------------------------------------

From the |chef server_title| shell, run the ``---`` delimited command from the previous step, in my case:

.. code-block:: bash

   sudo -i
   CHEF_APP_ID="compliance_server" AUTH_ID="Chef Server" COMPLIANCE_URL="https://compliance.test" INSECURE_SSL="true" CHEF_GATE_COMPLIANCE_SECRET="7fef11649f95d4de9e9334b103144f58e3e1fde12f49e5a70579143a7b48f7ebf25a0dab9c58b86460e392cb942a95b345bb" OIDC_CLIENT_ID="l0IL_ak15qZzkQtP_Orc5E0Gdka_3CYFVWHIjLKoh5o=@compliance.test" bash <( curl -k https://compliance.test/static/chef-gate.sh )

This will install a ``chef-gate`` service on the |chef server_title| to enable two main use-cases:

#. |chef server_title| to act as an OpenID Connect (OIDC) resource server.
#. |chef client| to request |chef compliance| profiles and report back.

When successful, you will see an installation line at the very end like:

.. code-block:: bash

   chef-compliance-ctl auth add --client-id "50b3447fd3db4f59d0160611eb25703f348887b6760482df5bd3ae2303f93c2d" --client-secret "3880ed856a14fce2201459e93d667da8fcd22f8ebbc1ad94d8a0a11959834b91" --id "Chef Server" --type ocid  --chef-url https://chef.compliance.test --insecure true

Copy this line and use it for the next step.

Configure |chef compliance|
-----------------------------------------------------
Execute the ``chef-compliance-ctl auth add ...`` command provided during the previous step in the |chef compliance| shell. When done, it will ask you to run ``chef-compliance-ctl reconfigure``.

Test OAuth 2 Integration
-----------------------------------------------------
Go to the |chef compliance| web interface and click the ``Use a different provider`` link. You'll be presented with these options:

 * ``Chef Server``, the |oauth| 2 authentication using the configured |chef server|. Accept the authorization request when prompted
 * ``Compliance Server``, the native |chef compliance| authentication option

Scan Managed Nodes
=====================================================
Once the integration is complete, the ``audit`` cookbook allows you to run |chef compliance| profiles as part of a |chef client| run. It downloads configured profiles from |chef compliance| and reports audit results to |chef compliance|, using |chef server_title| as a proxy.
The ``audit`` cookbook has been created with custom resources to allow for |chef compliance| profiles execution and reporting.

First upload the cookbook to the |chef server|, then use the cookbook in a recipe, and then run the |chef client|.

Upload Cookbook
-----------------------------------------------------
The ``audit`` cookbook is available at the following locations: https://supermarket.chef.io/cookbooks/audit and https://github.com/chef-cookbooks/audit. Upload it to the |chef server| using a normal workflow.

Use Cookbook
-----------------------------------------------------
You can either use the custom resources provided by the cookbook or add the ``audit::default`` recipe to the run-list of the nodes. The ``default`` recipe requires a ``node['audit']['profiles']`` attribute to be set. Here's an example of how do define it as part of a |json|-based role or environment file:

.. code-block:: bash

   "audit": {
     "profiles": {
       "base/ssh": true,
       "base/linux": true
     }
   }

.. note:: This cookbook requires up-to-date time on the nodes. Use ``ntp`` or similar software to prevent time drift.

Run the chef-client
-----------------------------------------------------
With the above steps completed, a |chef client| run will:

* Download the targeted profiles from |chef compliance|, and then run them locally via |inspec|.
* Log a summary of the audit execution.
* Submit the full report back to the |chef compliance| server. The reports will be saved in a |chef compliance| Organization with the same name as the Organization the server belongs to in |chef server|.