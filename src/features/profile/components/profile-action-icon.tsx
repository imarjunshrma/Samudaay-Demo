import { MaterialIcons } from '@expo/vector-icons';

export function ProfileActionIcon({
  name,
  color,
  topOffset = false,
}: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  topOffset?: boolean;
}) {
  return <MaterialIcons name={name} size={24} color={color} style={topOffset ? { marginTop: 4 } : undefined} />;
}
