# OpenShift deployment

This documentation is still in progress.

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

```
docker build -t ruokasovellus .
```

and then start it locally with

```
docker run -p 8080:8080 ruokasovellus
```

The server appears at `localhost:8080`.



## Build config

Now we have got the Docker part out of the way and
we can start to actually work with OpenShift.

First, we need to automate the build of the Docker image.
This can be done with `BuildConfig` configuration
in [`openshift/build.yaml`](../openshift/build.yaml).

We name our build process `ruokasovellus-build` in `metadata.name`.

In `spec.source` section we define where OpenShift should get the source code from.
In our case we give it the URL of the GitHub repository.

`spec.strategy` lets us define how the software should be built.
We use Docker images, so Docker build strategy is used.

In `spec.output` we tell OpenShift what it should do with the freshly built
Docker image. We tell it to store the image in an image stream (see next section),
and give it the `latest` tag as a mark of being the newest version of the image.

### Automatic build

TODO, github webhook, triggers


## Image stream

Image stream is a place to store built Docker images.
Images are kept in chronological order and the one that has been added last
is usually given the `latest` tag.
(If you are familiar with Docker Hub or another image registry,
you can think image streams in OpenShift as a local version of that.)

In our case, we just want a simple way to store and organize the build
Docker images of our server.
For that, we create an image stream called `ruokasovellus`
in [`openshift/image-stream.yaml`](../openshift/image-stream.yaml).


## Deployment

Now we have our image built and stored on the server, but it is not running.
With `Deployment` configuration (not `DeploymentConfig`, that doesn't work)
in [`openshift/deployemnt.yaml`](../openshift/deployment.yaml),
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

In `ports` section we tell OpenShift that our server uses port `8080`.

In `resources` section we state how much resources (CPU and memory) our
server container is willing to use.
Request is what is allocated for us at all times and limit is the hard maximum
that our container is allowed to ever use.
Limit is useful in making sure that we are not accidentally consuming all of our
billing units too quickly.

`startupProbe` is a way for the deployment to check that the pod has started.
We define a simple HTTP GET request to path `/` of port 8080.
After starting the container, OpenShift makes this request and expects
a non-faulty response code (200 or similar).

For `env` and `envFrom` parts, we first need to talk about other things.
We will come back to these later in this documentation. TODO


## Service

A pod can run on its own,
but it is not possible to access the pod directly from the outside
(e.g. handle web requests as a server or communicate with other pods).
We need to define a **service** for our pod to interact with it.

We declare `Service` configuration
in [`openshift/service.yaml`](../openshift/service.yaml).

In `metadata.name` we name this service `ruokasovellus-service`.
This is important later when we want pods to communcate with each other.

In `spec.ports` we tell OpenShift that whenever a request is made to
the port 8080 of this service (`port`), the request should be redirected
to the port 8080 of the container (`targetPort`).


## Route

Cool, now we have an automated build, a deployment and a service for it.
If we had multiple pods, they could now communicate with each other.
However, for security reasons, we can not reach the pod from the Internet
without further configuration.
We need to add `Route` configuration for our service
in [`openshift/route.yaml`](../openshift/route.yaml).

In `spec.host` we define the domain where we want our service to appear at.
In `spec.to` we define the service that the route points to
and in `spec.port` we state the port of the service.

And that's it! Now your server is online.
Next, let's take a look at a more difficult case where we add another pod
for the database.


## Database deployment

TODO
