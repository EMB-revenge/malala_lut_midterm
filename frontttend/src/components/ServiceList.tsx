import { useContext, useEffect } from "react";
import { ServiceContext } from "../context/ServiceContext";
import { fetchService } from "../api/serviceRoutes";

export const ServiceList: React.FC = () => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error("ServiceList must be used within a ServiceProvider.");
  const { state, dispatch } = context;

  useEffect(() => {
    const loadServices = async () => {
      dispatch({ type: "FETCH_START" });

      try {
        const data = await fetchService();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: (error as Error).message });
      }
    };
    loadServices();
  }, [dispatch]);
  
  if (state.loading) return <p>Loading services...</p>;
  if (state.error) return <p>Error: {state.error}</p>;

  return (
    <Grid>
      {state.services.map((service) => (
        <Card key={service.id}>
          <h4>{service.name}</h4>
          <p>
            <strong>Environment:</strong> {service.environment}
          </p>
          <p>
            <strong>Status:</strong> {service.status}
          </p>
          <p>
            <strong>Version:</strong> {service.version} • <strong>Endpoint:</strong> {service.endpointUrl}
          </p>
        </Card>
      ))}
    </Grid>
  );
};