# Build context is this directory (backend/Portfolio.Api). On Render, set the
# service's Root Directory to backend/Portfolio.Api so both the build context
# and this Dockerfile are found here.

# ---- Build ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Portfolio.Api.csproj ./
RUN dotnet restore Portfolio.Api.csproj

COPY . .
RUN dotnet publish Portfolio.Api.csproj -c Release -o /app/publish --no-restore

# ---- Runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
# The default appsettings.json/appsettings.{env}.json config sources watch the
# filesystem for hot-reload, each holding an inotify instance open. Render's
# containers cap inotify instances at 128 per user, and that watch is what
# exhausts it, crashing startup ("The configured user limit (128) on the
# number of inotify instances has been reached"). This bootstrap setting is
# read by the Generic Host before Program.cs runs, so the JSON sources are
# built without a watcher in the first place — not needed outside dev, since
# appsettings.json never changes after a container is deployed.
ENV DOTNET_hostBuilder__reloadConfigOnChange=false
# Documentation only — actual bind address/port is read from PORT at startup
# (see Program.cs). Render injects PORT dynamically; 8080 is just the default
# if it's ever missing.
EXPOSE 8080

ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
