export type VirtualCard = {
  id: string;
  title: string;
  imageUrl: string;
  estimatedTime: number | null;
  creator: {
    id: string;
    name: string | null;
  };
};
