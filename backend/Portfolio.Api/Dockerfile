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
# Documentation only — actual bind address/port is read from PORT at startup
# (see Program.cs). Render injects PORT dynamically; 8080 is just the default
# if it's ever missing.
EXPOSE 8080

ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
