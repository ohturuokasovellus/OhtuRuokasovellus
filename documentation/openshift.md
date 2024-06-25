# OpenShift deployment

![OpenShift architecture diagram](assets/openshift-diagram.svg)

## Foreword

Our OpenShift architecture consists of two parallel systems:
staging and production.
These two run with very similar configurations with only small differences.
This documentation concentrates primarily on the staging part
and the differences to production are talked at the end.

### Prerequisities

Before starting, make sure that you have access to the web interface of your
OpenShift platform. In our case, for example, go to `rahti.csc.fi` and log in
to Rahti 2.

In addition to the web interface, you also have to run commands in terminal,
so you need OpenShift CLI tool `oc`. See
[installation page](https://docs.openshift.com/container-platform/4.15/cli_reference/openshift_cli/getting-started-cli.html)
for instructions.

`oc` tool must also be logged in to your account.
In the web interface, click your name in the top right corner and then click
"Copy login command". Log in with your credentials, click Display token and
copy the command starting with `oc`.
Run this command in your terminal to log the `oc` tool in to your account.
The login seems to expire automatically in 24 hours,
so you have to repeat this step daily
(to check if `oc` is logged in,
run `oc project` and see if some project is selected).

#### Usage

Whenever making changes to any of the YAML configuration files,
they have to made into force by running

```sh
oc apply -f myconfigfile.yaml
```


## Docker image

Docker image of our server is at the core of OpenShift deployment.
It is built by following the specification in [`Dockerfile`](../Dockerfile).
Docker first installs NPM dependencies, makes a production build and
then exports required resources to the final image.
The server is run as a non-root `node` user for additional security.

**Tip:** If you are unfamiliar with Docker images and Dockerfiles,
take a look at this quick section of
[an online course material](https://devopswithdocker.com/part-1/section-3#building-images).


**Optional:**
If you have Docker
[installed](https://devopswithdocker.com/getting-started#installing-docker)
on your computer, you can build the image locally
for testing, debugging and learning purposes by running

```sh
docker build -t ruokasovellus .
```

and then start it locally with

```sh
docker run -p 8080:8080 ruokasovellus
```

The server appears at `localhost:8080`.



## Build config

Now we have got the Docker part out of the way and
we can start to actually work with OpenShift.

First, we need to automate the build of the Docker image.
This can be done with `BuildConfig` configuration
in [`openshift/build.yaml`](../openshift/build.yaml).

In `spec.source` section we define where OpenShift should get the source code from.
In our case we give it the URL of the GitHub repository.

`spec.strategy` lets us define how the software should be built.
We use Docker images, so Docker build strategy is used.

In `spec.output` we tell OpenShift what it should do with the freshly built
Docker image. We tell it to store the image in an image stream (see next section),
and give it the `latest` tag as a mark of being the newest version of the image.

In `spec.resources` we define the amount of resources we allow
the build process to use. This may have a significant effect on the time
it takes to build the image.

### Automatic build

Now the build process can be started either with the command-line tool
or via the web interface.
Luckily we can also make a connection between OpenShift and GitHub so that
the build process is triggered automatically when changes are pushed
to the repository.
This connection is called a webhook.

First, let's add a secret for this webhook.
Secret is a way to store sensitive data such as credentials without
placing them in plaintext to the YAML files.
In the web interface, navigate to Secrets and click Create, then Webhook secret.
Give the secret a name (`ruokasovellus-generic-webhook-secret` in our case)
and value by clicking the Generate button.

Next, let's add a trigger section to the build configuration
(in [`openshift/build.yaml`](../openshift/build.yaml)).
In `spec.triggers[0]` we define that we want the build to
be triggered by a webhook.
We also give a secret reference to the secret that we just created.

Then, we need to get the webhook URL.
This can be done by navigating to Builds in the web interface,
going to the page of the build process and
clicking the "Copy URL with Secret" button.

Now OpenShift is ready for the trigger and we move on to preparing GitHub.
We want to add a job to the GitHub Actions workflow
(in [`.github/workflows/CI.yml](../.github/workflows/CI.yml)),
so that the build is triggered whenever something is
pushed or merged to main branch.
We need the workflow to run command

```
curl -X POST -k https://your-openshift.com/apis/build.openshift.io/v1/namespaces/something/buildconfigs/your-build-config/webhooks/s0m3secret/generic
```

Obviously change the URL in the command with the URL
you copied in the previous step.
Since the URL is kinda secret
(you don't want anyone to be able to trigger you build),
it is a good idea to place it in the GitHub secrets at
Repository settings > Secrets and variables > Actions > Repository secrets.

Now the connection between GitHub and OpenShift is finished and
our build configuration is triggered whenever someone pushes changes to main.


## Image stream

Image stream is a place to store built Docker images.
Images are kept in chronological order and the one that has been added last
is usually given the `latest` tag.
(If you are familiar with Docker Hub or another image registry,
you can think image streams in OpenShift as a local version of that.)

In our case, we just want a simple way to store and organize the built
Docker images of our server.
For that, we create an image stream called `ruokasovellus`
in [`openshift/image-stream.yaml`](../openshift/image-stream.yaml).


## Deployment

Now we have our image built and stored on the server, but it is not running.
With `Deployment` configuration (not `DeploymentConfig`, that doesn't work)
in [`openshift/staging-deployment.yaml`](../openshift/staging-deployment.yaml),
we can start an image from the image stream with the `latest` tag.

In `spec.template.spec.containers` section, we define what containers
(i.e. instances of an image) our **pod** should have running.
In OpenShift, pod is a piece of software that can be duplicated
to achieve more performance for our server.
For example, we could set `spec.replicas` to 5 and have five identical
instances of the pod running simultaneously
(possibly on different computers in the cluster)
and thus have much more computing power than a single instance.
In our case, however, we only need a single instance of the pod.

In our deployment, we want the pod to contain only the server image.
In `spec.template.spec.containers[0].image` we give the directions of where
to find the image. The part before the first slash is an internal link
for OpenShift to understand that we mean an image stream.
The middle part between slashes is the name of our image stream and the last
part refers to the image and its newest available version.

In `ports` section we tell OpenShift that our container exposes port `8080`.

In `resources` section we state how much resources (CPU and memory) our
server container is willing to use.
Request is what is allocated for us at all times and limit is the hard maximum
that our container is allowed to ever use.
Limit is useful in making sure that we are not accidentally consuming all of our
billing units too quickly.

`startupProbe` is a way for the deployment to check that the pod has started.
We define a simple HTTP GET request to path `/devops/health` of port 8080.
That endpoint is coded to check that the server and database connection
is healthy and responses status code 200 or 500 accordingly.
After starting the container, OpenShift makes this request and expects
a non-faulty response code (200 or similar).

For `env` and `envFrom` parts, we define environment variables
that are passed to the container.
We place plaintext (that is, non-secret) variables in `env`.
Note that we can use other environment variables with `$(VAR_NAME)` notation.

In `envFrom` section, we tell OpenShift to load environment variables
from a secret.
Secrets are created similarly to [automatic build configuration](#automatic-build),
but this time instead of creating Webhook secret, we use "Key/value secret".
Here we can define multiple key-value pairs
(keys `POSTGRES_PASSWORD`, `SECRET_KEY` and `DATABASE_ENCRYPTION_KEY` in our case)
in one secret (called `ruokasovellus-staging`).


## Service

A pod can run on its own,
but it is not possible to access the pod directly from the outside
(e.g. handle web requests as a server or communicate with other pods).
We need to define a **service** for our pod to interact with it.

We declare `Service` configuration
in [`openshift/staging-service.yaml`](../openshift/staging-service.yaml).

In `metadata.name` we name this service `ruokasovellus-staging-service`.
This is important later when we want pods to communcate with each other.

In `spec.ports` we tell OpenShift that whenever a request is made to
the port 8080 of this service (`port`), the request should be redirected
to the port 8080 of the container (`targetPort`).


## Route

Cool, now we have an automated build, a deployment and a service for it.
If we had multiple pods, they could now communicate with each other.
However, for security reasons, we can not reach the pod from the Internet
without further configuration.
We need to add `Route` configuration for our service.

For cleaner repository, we place this small configuration into existing
[`openshift/staging-service.yaml`](../openshift/staging-service.yaml) file.
This is possible when configs are separated with three dashes `---`.
The placement of the configurations is not very important, but can be used
to keep the repository clean the same way code is split across multiple files.

In `spec.host` we define the domain where we want our service to appear at.
In `spec.to` we define the service that the route points to
and in `spec.port` we state the port of the service.

And that's it! Now your server is online.
Next, let's take a look at a more difficult case where we add another pod
for the database.


## Database deployment

Whenever we want to add a new pod,
we need to add a new `Deployment` configuration
(in [`openshift/staging-db.yaml`](../openshift/staging-db.yaml)).
It looks almost the same as the deployment of our server with a few exceptions.

This time, we do not want to use image stream in `containers[0].image`,
but load the image directly from Docker Hub instead.

We give the container some environment variables in `containers[0].env`.
The `POSTGRES_DB` variable has a constant value `ruokasovellus` that is not
sensitive, so it can be written directly to the YAML file.

`POSTGRES_PASSWORD` env variable, on the other hand, is sensitive, so we
pass it as a secret reference.
Note that this time we only want one key from the key-value secret,
so instead of using `envFrom` like in server deployment,
we use `env[0].valueFrom.secretKeyRef` and give it the key that we want to pull.

In `spec.strategy` we tell OpenShift how to apply updates.
`maxSurge` and `maxUnavailable` make sure that all of the existing pods are
terminated before new ones are created.
This is important, because the volume (see below) can only
be used by a single pod at a time.

In `spec.triggers` we tell OpenShift that the pod should be updated
whenever the configuration is changed.

### Volume mount

Database needs disk space to store its contents.
In OpenShift, we can request disk space by making
a new persistent volume claim (PVC).
This can be done in the web interface by navigating to Project,
clicking "n PersistentVolumeClaims" button and
clicking "Create PersistentVolumeClaim".
Give your PVC a name (`ruokasovellus-db-pvc-2` in our case) and choose a size.

Next, we need to connect our PVC to the database.
In the database deployment configuration, we can give our pod the right to use
the volume in `spec.template.spec.volumes`.
The `claimName` must match the name that you chose for your PVC earlier.
`volumes[0].name` can be choosed freely (`ruokasovellus-db-staging-storage` in our case).

Now our pod can use the volume but we still need to instruct Postgres to
place its files there.
In `containers[0].volumeMounts` you give the name that you used
in `volumes[0].name` and a path where the volume appears in the container.
Postgres keeps its files in `/var/lib/postgresql/data`, so we choose the
supdirectory of that as a mount path.

In the `spec.template.spec.initContainers` section of
the deployment configuration we can define scripts that
are run before starting the container.
In the `command` we instruct OpenShift to create the `data` directory for
Postgres if it does not already exist.

(You might be wondering why we can't use `/var/lib/postgresql/data` directly
as a mount point. The reason is that Postgres wants the `data` directory to be
absolutely empty before it starts using it.
OpenShift, however, adds some of its own files to the mount path,
which would prevent Postgres from using it.)

### Service

As mentioned earlier in this documentation,
pods can only communicate with each other when they are wrapped with services.
Obviously, we want our server pod to be able to make queries to the database,
so we need to setup a service for the database deployment.

The service is very similar to the one created for the server pod earlier.
Like earlier, we place this tiny configuration to
the same file with a triple-dash separator.

**Note** that for the database we do not define a route.
This is because route would make the database available to the Internet,
which we don't want to happen.
(Of course the database would still be protected with a password,
but better safe than sorry.)

### Formatting the database

To format the database, make sure that you have the latest `schema.sql`
locally on your computer.
Then run the following command:

```
oc get pods
```

From the output pick the name of your database pod
(in our case it is something like `ruokasovellus-db-staging-xxxxxxxxxx-xxxxx`).

Then run the following two commands:

```
oc cp schema.sql podname-xxxxxxxxxx-xxxxx:/tmp/schema.sql
oc exec -it podname-xxxxxxxxxx-xxxxx -- psql -U postgres -d dbname -f /tmp/schema.sql
```

The first command copies the `schema.sql` file from you local machine to the pod.
The second command runs `psql` command on the pod.
You may need to modify the arguments given to `psql` command according to your
database setup (database name etc.).

**Note:** If you want to modify the database schema of an existing database,
in the web interface navigate to the running pod, then Terminal, run

```sh
psql -U postgres -d dbname
```

and then you can run regular SQL commands.


## Production server and database

Now that you have a staging server running,
let's see how production differs from that.

The key difference is that we don't want production to automatically
update the image whenever the build finishes.
Instead, we want start the rollout of the server
whenever a new GitHub release is published.

Let's start by creating a duplicate of deployment, service, route, database,
persistent volume claim and secrets with `prod` prefix/suffix.
Note that we don't want to have multiple builds or image streams
as we want to reuse the built image from staging to production.

To be able to update server on GitHub releases,
we need to create a new GitHub Actions workflow in
[`.github/workflows/release.yaml](../.github/workflows/release.yaml).

In the first workflow step, we want to log in to our OpenShift server.
However, it would be some extremely bad practise to use the credentials of
some of the team members, so we want to create a new user for this.
In the web interface, switch to Administrator mode, and then navigate to
User Management, ServiceAccounts and Create ServiceAccount.
In the YAML editor, write this configuration:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: github-deployer-sa
  namespace: ruokasovellus
```

Next, under User Management go to RoleBindings to grant the new account
access to our project.
Click Create binding, enter a nice name for the binding and set
namespace to your project.
From the role dropdown select `edit` and in the subject section select
the freshly created service account.

Next, back in Developer mode, navigate to Secrets and find a secret called
something like `github-deployer-sa-token-xxxxx`.
Copy the token of this secret as it is what we need
to use this account to manage our production server.

Back in the first step of the GitHub workflow,
we pass the copied token using GitHub secrets.
For the OpenShift server URL, we give the output of command

```sh
oc whoami --show-server
```

In the last step, we run command

```sh
oc set image deployment/ruokasovellus-prod ruokasovellus=ruokasovellus:latest --source=imagestreamtag
```

which starts reroll of our production server.
Here `ruokasovellus-prod` is the value of
`metadata.name` field in our deployment configuration.
The first `ruokasovellus` refers to the container name in that deployment
and `ruokasovellus:latest` matches `spec.output.to.name` of our build config.

### Custom domain and TLS

To add a custom domain to our service,
we need to add another route to the production service.
We place the new route configuration into an existing
[`openshift/prod-service.yaml`](../openshift/prod-service.yaml) file
and call it `ruokasovellus-route-prod-domain`.
This time, `spec.host` is set to the custom domain instead of Rahti subdomain.

Next, using the web interface of your DNS provider,
let's make the custom domain point to the Rahti servers.
Add a new `CNAME` DNS record with name being `yourdomain.com`
and value (a.k.a. content) being `router-default.apps.2.rahti.csc.fi`
(see [docs](https://docs.csc.fi/cloud/rahti2/networking/#custom-domains)).
Note that if you have existing `A` records for the same (sub)domain,
they must be deleted before adding the `CNAME` record.

At this point, the domain is correctly pointing to the Rahti production server.
However, for production we want to use encrypted HTTPS connection,
which must be configured separately.

Let's follow
[this documentation](https://docs.csc.fi/cloud/tutorials/custom-domain/#lets-encrypt)
to generate a TLS certificate for our server.
Run the following commands one-by-one locally on your computer:

<!--
if you are wondering what I was thinking when writing this,
the commands are in separate blocks for easier copy-paste ;)
-->

```sh
git clone https://github.com/tnozicka/openshift-acme.git
```

<!-- the latest commit in that repo at the time of writing this was bdd71b7 -->

```sh
rm -rf openshift-acme/.git
```

```sh
cd openshift-acme
```

```sh
oc apply -f deploy/single-namespace/role.yaml -f deploy/single-namespace/serviceaccount.yaml -f deploy/single-namespace/issuer-letsencrypt-live.yaml -f deploy/single-namespace/deployment.yaml
```

```sh
oc create rolebinding openshift-acme --role=openshift-acme --serviceaccount="$( oc project -q ):openshift-acme" --dry-run -o yaml | oc apply -f -
```

Now you have a new pod called `openshift-acme` running.
What it does is it obtains a TLS certificate from
[Let's Encrypt](https://letsencrypt.org/)
and gives it for the route of our choice.
What's even cooler is that it automatically refreshes the certificate
every 3 months so it will never expire.

The next thing we need to do it tell Acme which route we want to secure.
You can do so by locally running the following command:

```sh
oc annotate route your-route-name kubernetes.io/tls-acme='true'
```

Replace `your-route-name` with the name of the route configuration
(in our case, run this command
first with `ruokasovellus-route-prod-domain` and
then with `ruokasovellus-route-prod-domain-www`).

Lastly, let's make the route aware of the TLS.
Add `spec.tls` section to the route configuration
(in [`openshift/prod-service.yaml`](../openshift/prod-service.yaml)).

`spec.tls.termination` with value `edge` tells the route to decrypt the
incoming messages and pass them plaintext to the server.
This is handy because we don't need to configure our Node server
to know anything about HTTPS.

In `spec.tls.insecureEdgeTerminationPolicy` we tell the route to redirect
all insecure HTTP connection to HTTPS.
This way we actually prevent users from using the service without TLS.


## Helps for debugging

Here is a collection of command-line commands that I found useful in debugging.

Show the history of an image stream:

```
oc describe is image-stream-name
```

List running pods
(and get the pod name `podname-abc-123` used in the commands below):

```
oc get pods
```

Copy a local file from your computer to a pod:

```
oc cp localfile.txt podname-abc-123:/path/to/remotefile.txt
```

Run any terminal command on a pod:

```
oc exec -it podname-abc-123 -- command --here --example 3141
```

List environment variables that a pod has:

```
oc exec -it podname-abc-123 -- printenv
```
