"use client";

import MultipleSelector, { Option } from "@/components/ui/MultipleSelector";
import { useQuery } from "@apollo/client";
import { useAuth } from "@/contexts/AuthContext";
import { GET_SERVICES } from "@/graphql/queries/servicesQueries";

interface ServiceNode {
  id: number;
  name_ru: string;
  name_en: string;
  name_et: string;
  duration_minutes: number;
  price: number;
}

interface ServiceEdge {
  node: ServiceNode;
}

interface ServiceListProps {
  onChange?: (selectedIds: number[]) => void;
}

const ServiceList = ({ onChange }: ServiceListProps) => {
  const { user, accessToken } = useAuth();

  const { data, loading, error } = useQuery(GET_SERVICES, {
    skip: !user,
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-only",
    context: {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    },
  });
  if (!user) return null;

  if (loading) return <p>Loading ...</p>;
  if (error) {
    console.error("GraphQL error:", error);
    return <p>Error during service loading: {error.message}</p>;
  }

  const selectedLanguage =
    typeof window !== "undefined"
      ? localStorage.getItem("i18nextLng") || "et"
      : "et";

  const languageFieldMap: Record<string, keyof ServiceNode> = {
    ru: "name_ru",
    en: "name_en",
    et: "name_et",
  };

  const field = languageFieldMap[selectedLanguage] || "name_en";

  const options: Option[] =
    (data.servicesCollection?.edges as ServiceEdge[] | undefined)?.map(
      (edge) => ({
        label: `${edge.node[field]} - ${edge.node.price}E - ${edge.node.duration_minutes} min`,
        value: String(edge.node.id),
      })
    ) || [];

  return (
    <MultipleSelector
      selectFirstItem={false}
      defaultOptions={options}
      placeholder="Select services..."
      onChange={(selectedOptions: Option[]) => {
        const selectedIds = selectedOptions.map((option) =>
          parseInt(option.value, 10)
        );
        if (onChange) {
          onChange(selectedIds);
        }
      }}
      emptyIndicator={
        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
          No results
        </p>
      }
    />
  );
};

export default ServiceList;
