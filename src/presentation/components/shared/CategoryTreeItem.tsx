import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CategoryTree } from '../../../domain/entities/Category';

type Props = {
  node: CategoryTree;
  depth: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export function CategoryTreeItem({ node, depth, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <View>
      <View style={[styles.row, { paddingLeft: 16 + depth * 20 }]}>
        <View style={[styles.colorDot, { backgroundColor: node.color }]} />
        <TouchableOpacity
          style={styles.nameContainer}
          onPress={() => hasChildren && setExpanded((v) => !v)}
        >
          <Text style={styles.name}>{node.name}</Text>
          {hasChildren && (
            <Text style={styles.chevron}>{expanded ? '▾' : '▸'}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEdit(node.id)} style={styles.action}>
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(node.id)} style={styles.action}>
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      {expanded &&
        node.children.map((child) => (
          <CategoryTreeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    color: '#111827',
  },
  chevron: {
    fontSize: 12,
    color: '#6B7280',
  },
  action: {
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 16,
  },
});
